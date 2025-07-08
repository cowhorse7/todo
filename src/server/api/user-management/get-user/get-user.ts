import { z } from 'zod/v4';
import { TRPCError } from '@trpc/server';
import { keycloakApi } from '@fhss-web-team/backend-utils';
import { authenticatedProcedure, publicProcedure } from '../../trpc';
import { prisma } from '../../../../../prisma/client';

const getUserInput = z.object({
  userId: z.string(),
});

const getUserOutput = z.object({
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
  lastLogin: z.date().nullable()
});

export const getUser = publicProcedure
  .meta({ allowedRoles: ['admin'] })
  .input(getUserInput)
  .output(getUserOutput)
  .query(async (opts) => {
    const user = await prisma.user.findUnique({
      where: { id: opts.input.userId },
    });
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      });
    }

    const roles = await keycloakApi.getUserAppRoles(user.keycloakId);
    return {
      ...user,
      roles: roles.map((role) => role.name),
    };
  });
