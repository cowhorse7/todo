import { userService } from './user';
import {
  ByuAccountType,
  Prisma,
  prisma,
  User,
} from '../../../../prisma/client';
import { faker } from '@faker-js/faker';
import {
  byuAccountService,
  KeycloakRole,
  KeycloakUser,
  keycloakApi,
  generateDummyAccountData,
} from '@fhss-web-team/backend-utils';
import { defaultRole } from '../../../roles';

describe('User Service', () => {
  const userAcct = generateDummyAccountData(ByuAccountType.Student);
  const userKc: KeycloakUser = {
    id: faker.string.uuid(),
    username: userAcct.netId,
    firstName: userAcct.firstName,
    lastName: userAcct.lastName,
    email: `${userAcct.netId}@byu.edu`,
    enabled: true,
    emailVerified: true,
    realmRoles: defaultRole ? [defaultRole] : undefined,
  };
  const user: User = {
    id: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    accountType: ByuAccountType.Student,
    netId: userAcct.netId,
    byuId: userAcct.byuId!,
    workerId: null,
    firstName: userAcct.firstName,
    middleName: userAcct.middleName,
    lastName: userAcct.lastName,
    suffix: null,
    preferredFirstName: userAcct.preferredFirstName,
    preferredLastName: userAcct.preferredLastName,
    keycloakId: userKc.id,
  };
  const role: KeycloakRole = {
    id: 'asdf',
    name: 'user',
    description: 'app_user',
    containerId: 'asdfasdf',
  };

  describe('Create User', () => {
    it('creates a user', async () => {
      spyOn(
        byuAccountService,
        'getAccountsByNetId',
      ).and.returnValue(Promise.resolve([userAcct]));
      spyOn(keycloakApi, 'createUser').and.callFake(
        (kcUser) => {
          expect(kcUser.username).toEqual(user.netId);
          expect(kcUser.firstName).toEqual(user.firstName);
          return Promise.resolve();
        },
      );
      spyOn(keycloakApi, 'getUserByNetId').and.callFake(
        (netId) => {
          expect(netId).toBe(user.netId);
          return Promise.resolve(userKc);
        },
      );

      spyOn(keycloakApi, 'addRolesToUser').and.callFake(() => {
        return Promise.resolve();
      });
      spyOn(prisma.user, 'create').and.returnValue(
        Promise.resolve(user) as unknown as Prisma.Prisma__UserClient<any>,
      );

      const result = await userService.createUser(userAcct, role);

      expect(result).toEqual(user);
    });

    it("errors on create if keycloak account isn't found", async () => {
      spyOn(keycloakApi, 'createUser').and.callFake(
        () => {
          return Promise.resolve();
        },
      );
      spyOn(keycloakApi, 'getUserByNetId').and.callFake(() =>
        Promise.resolve(null),
      );
      spyOn(prisma.user, 'create');

      let thrown = false;
      try {
        await userService.createUser(userAcct, role);
      } catch {
        thrown = true;
      }

      expect(thrown).toBeTruthy();
    });
  });

  describe('Provision User', () => {
    it('provisions a user', async () => {
      spyOn(keycloakApi, 'getUserByNetId').and.callFake(
        (netId) => {
          expect(netId).toBe(user.netId);
          return Promise.resolve(userKc);
        },
      );
      spyOn(keycloakApi, 'getAppRole').and.callFake(() => {
        return Promise.resolve({
          id: 'idkid',
          name: 'role1',
          description: 'app_role',
          containerId: 'asdf',
        });
      });
      spyOn(keycloakApi, 'addRolesToUser').and.callFake(
        () => {
          return Promise.resolve();
        },
      );
      spyOn(prisma.user, 'create').and.returnValue(
        Promise.resolve(user) as unknown as Prisma.Prisma__UserClient<any>,
      );

      const result = await userService.provisionUser(userAcct);
      expect(result).toEqual(user);
    });

    it("errors on provision if keycloak account isn't found", async () => {
      spyOn(keycloakApi, 'getUserByNetId').and.callFake(() => {
        return Promise.resolve(null);
      });
      spyOn(prisma.user, 'create');

      let thrown = false;
      try {
        await userService.provisionUser(userAcct);
      } catch {
        thrown = true;
      }

      expect(thrown).toBeTruthy();
    });
  });

  describe('Update User', () => {
    it('updates a user', async () => {
      spyOn(prisma.user, 'findUnique').and.returnValue(
        Promise.resolve(user) as unknown as Prisma.Prisma__UserClient<User>,
      );
      spyOn(
        byuAccountService,
        'getAccountsByNetId',
      ).and.callFake(() => Promise.resolve([userAcct]));
      spyOn(prisma.user, 'update').and.returnValue(
        Promise.resolve(user) as unknown as Prisma.Prisma__UserClient<User>,
      );

      const result = await userService.updateUser(user.id);
      expect(result).toEqual(user);
    });

    it('errors on update if no account', async () => {
      spyOn(prisma.user, 'findUnique').and.returnValue(
        Promise.resolve(user) as unknown as Prisma.Prisma__UserClient<User>,
      );
      spyOn(
        byuAccountService,
        'getAccountsByNetId',
      ).and.callFake(() => Promise.resolve([]));
      spyOn(prisma.user, 'update').and.returnValue(
        Promise.resolve(user) as unknown as Prisma.Prisma__UserClient<User>,
      );

      let threw = false;
      try {
        await userService.updateUser(user.id);
      } catch {
        threw = true;
      }

      expect(threw).toBeTruthy();
      expect(prisma.user.update).not.toHaveBeenCalled()
    });
  });

  describe('Delete User', () => {
    it('deletes a user', async () => {
      spyOn(prisma.user, 'delete').and.returnValue(Promise.resolve(
          user,
        ) as unknown as Prisma.Prisma__UserClient<User>
      );
      spyOn(keycloakApi, 'deleteUser').and.callFake(() => {
        return Promise.resolve();
      });

      const result = await userService.deleteUser(user.id);

      expect(result).toEqual(user);
      expect(keycloakApi.deleteUser).toHaveBeenCalledTimes(1);
    });
  });
});
