import z from 'zod/v4';
import {
  byuApi,
  keycloakApi,
  KeycloakRole,
} from '@fhss-web-team/backend-utils';
import { TRPCError } from '@trpc/server';
import { Prisma } from '../../../../../prisma/client';
import { userService } from '../../../services/user/user';
import { defaultRole } from '../../../../roles';
import { authenticatedProcedure } from '../../trpc';

const createUserInput = z.object({
  netId: z.string(),
  roleName: z.string().optional(),
});

const createUserOutput = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  accountType: z.string(),
  netId: z.string(),
  byuId: z.string().nullable(),
  workerId: z.string().nullable(),
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  suffix: z.string().nullable(),
  preferredFirstName: z.string(),
  preferredLastName: z.string(),
  keycloakId: z.string(),
  roles: z.array(z.string()),
});

export const createUser = authenticatedProcedure
  .meta({ allowedRoles: ['admin'] })
  .input(createUserInput)
  .output(createUserOutput)
  .mutation(async (opts) => {
    try {
      const acct = (await byuApi.getBasicAccountsByNetId(opts.input.netId))[0];
      if (!acct) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Account '${opts.input.netId}' could not be found`,
        });
      }

      let role: KeycloakRole | null = null;
      if (opts.input.roleName) {
        role = await keycloakApi.getAppRole(opts.input.roleName);
      } else if (defaultRole) {
        role = await keycloakApi.getAppRole(defaultRole);
      }
      if (!role) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Role '${opts.input.roleName}' does not exist`,
        });
      }

      const user = await userService.createUser(acct, role);

      return {
        ...user,
        roles: [role.name],
      };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        });
      } else {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error attempting to create user',
          cause: err,
        });
      }
    }
  });
