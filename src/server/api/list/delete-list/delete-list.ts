
import { z } from 'zod';
import { Prisma } from '../../../../../prisma/client';
import { authenticatedProcedure } from '../../trpc';

const deleteListInput = z.null();

const deleteListOutput = z.void();

export const deleteList = authenticatedProcedure
  .meta({ allowedRoles: [] })
  .input(deleteListInput)
  .output(deleteListOutput)
  .mutation(async (opts) => {
    // Your logic goes here
  });
