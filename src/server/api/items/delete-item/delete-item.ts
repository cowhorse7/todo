
import { z } from 'zod';
import { Prisma } from '../../../../../prisma/client';
import { authenticatedProcedure } from '../../trpc';

const deleteItemInput = z.null();

const deleteItemOutput = z.void();

export const deleteItem = authenticatedProcedure
  .meta({ allowedRoles: [] })
  .input(deleteItemInput)
  .output(deleteItemOutput)
  .mutation(async (opts) => {
    // Your logic goes here
  });
