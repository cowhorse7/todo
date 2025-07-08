import { z } from 'zod/v4';
import { userService } from '../../../services/user/user';
import { Prisma } from '../../../../../prisma/client';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../trpc';

const deleteUserInput = z.object({
  netId: z.string(),
});

const deleteUserOutput = z.void();

export const deleteUser = authenticatedProcedure
  .meta({ allowedRoles: ['admin'] })
  .input(deleteUserInput)
  .output(deleteUserOutput)
  .mutation(async (opts) => {
    try {
      await userService.deleteUser(opts.input.netId);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2015'
      ) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        });
      }
    }
  });
