
import { z } from 'zod';
import { Prisma } from '../../../../../prisma/client';
import { authenticatedProcedure } from '../../trpc';

const updateItemInput = z.null();

const updateItemOutput = z.void();

export const updateItem = authenticatedProcedure
  .meta({ allowedRoles: [] })
  .input(updateItemInput)
  .output(updateItemOutput)
  .mutation(async (opts) => {
    // Your logic goes here
  });
