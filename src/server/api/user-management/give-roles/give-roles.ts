import { z } from 'zod/v4';
import { TRPCError } from '@trpc/server';
import { keycloakApi, KeycloakRole } from '@fhss-web-team/backend-utils';
import { authenticatedProcedure } from '../../trpc';
import { prisma } from '../../../../../prisma/client';

const giveRolesInput = z.object({
  userId: z.string(),
  roleNames: z.array(z.string()).min(1),
});

const giveRolesOutput = z.void();

export const giveRoles = authenticatedProcedure
  .meta({ allowedRoles: ['admin'] })
  .input(giveRolesInput)
  .output(giveRolesOutput)
  .mutation(async (opts) => {
    const user = await prisma.user.findUnique({
      where: { id: opts.input.userId },
    });
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Specified user does not exist',
      });
    }

    const allRoles = await keycloakApi.getAppRoles();
    const allRoleMap = new Map(allRoles.map((r) => [r.name, r]));
    const validRoles: KeycloakRole[] = [];
    const invalidNames: string[] = [];

    opts.input.roleNames.forEach((name) => {
      const role = allRoleMap.get(name);
      if (role) {
        validRoles.push(role);
      } else {
        invalidNames.push(name);
      }
    });

    if (invalidNames.length) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid role name(s) given: '${invalidNames.join(',')}'`,
      });
    }

    await keycloakApi.addRolesToUser(user.keycloakId, validRoles);
  });
