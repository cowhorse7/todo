import { prisma, User } from '../../../../prisma/client';
import { defaultRole } from '../../../roles';
import {
  ByuAccount,
  keycloakApi,
  KeycloakRole,
  byuAccountService,
} from '@fhss-web-team/backend-utils';

class UserService {
  /**
   * Provisions a new user by retrieving their BYU account and Keycloak account details,
   * assigning the default role, and then creating a corresponding user record in the database.
   *
   * @param byuAccount - The Net ID of the user to be created.
   * @returns A promise that resolves to the created `User` object
   */
  public async provisionUser(byuAccount: ByuAccount): Promise<User> {
    const kc = await keycloakApi.getUserByNetId(byuAccount.netId);
    if (!kc) throw new Error("User's keycloak account could not be found");

    if (defaultRole) {
      const role = await keycloakApi.getAppRole(defaultRole);
      if (!role) throw new Error('Default role could not be found');
      await keycloakApi.addRolesToUser(kc.id, [role]);
    }
    return await prisma.user.create({
      data: {
        accountType: byuAccount.type,
        firstName: byuAccount.firstName,
        middleName: byuAccount.middleName,
        lastName: byuAccount.lastName,
        suffix: byuAccount.suffix,
        preferredFirstName: byuAccount.preferredFirstName,
        preferredLastName: byuAccount.preferredLastName,
        netId: byuAccount.netId,
        byuId: byuAccount.byuId,
        workerId: byuAccount.workerId,
        keycloakId: kc.id,
      },
    });
  }

  /**
   * Creates a new user in the system by retrieving their BYU account
   * and creating a new Keycloak account with the provided role.
   *
   * @param byuAccount - The account of the user to be created.
   * @param role - The role to assign to the user in Keycloak.
   * @returns A promise that resolves to the created `User` object
   */
  public async createUser(
    byuAccount: ByuAccount,
    role: KeycloakRole,
  ): Promise<User> {
    try {
      await keycloakApi.createUser({
        username: byuAccount.netId,
        firstName: byuAccount.firstName,
        lastName: byuAccount.lastName,
        email: `${byuAccount.netId}@byu.edu`,
        enabled: true,
        emailVerified: true,
      });
    } catch (err) {
      if (err instanceof Error && !err.message.includes('409')) {
        throw err;
      }
    }
    const kc = await keycloakApi.getUserByNetId(byuAccount.netId);
    if (!kc) throw new Error("User's keycloak account could not be found");

    await keycloakApi.addRolesToUser(kc.id, [role]);

    return await prisma.user.create({
      data: {
        accountType: byuAccount.type,
        firstName: byuAccount.firstName,
        middleName: byuAccount.middleName,
        lastName: byuAccount.lastName,
        suffix: byuAccount.suffix,
        preferredFirstName: byuAccount.preferredFirstName,
        preferredLastName: byuAccount.preferredLastName,
        netId: byuAccount.netId,
        byuId: byuAccount.byuId,
        workerId: byuAccount.workerId,
        keycloakId: kc.id,
      },
    });
  }

  /**
   * Updates a user with their latest BYU account info
   * @param userId - The ID of the user to update.
   * @returns A promise that resolves to the updated user data
   */
  public async updateUser(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const byu = (await byuAccountService.getAccountsByNetId(user.netId))[0];
    if (!byu) throw new Error('User BYU account not found');

    return await prisma.user.update({
      where: { id: userId },
      data: {
        accountType: byu.type,
        firstName: byu.firstName,
        middleName: byu.middleName,
        lastName: byu.lastName,
        suffix: byu.suffix,
        preferredFirstName: byu.preferredFirstName,
        preferredLastName: byu.preferredLastName,
        netId: byu.netId,
        byuId: byu.byuId,
        workerId: byu.workerId,
        keycloakId: user.id,
      },
    });
  }

  /**
   * Deletes a user from the database
   * @param userId The ID of the user to delete. Will throw an error if user is not found
   * @returns The deleted user
   */
  public async deleteUser(userId: string): Promise<User> {
    const user = await prisma.user.delete({ where: { id: userId } }); // Throws if user not found
    await keycloakApi.deleteUser(user.keycloakId);
    return user;
  }

  public async getNetIdByUserId(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({where: {id: userId} });
    if (!user) throw new Error('User not found');
    return user.netId;
  }
}


/**
 * A service for managing site user data.
 */
export const userService = new UserService();
