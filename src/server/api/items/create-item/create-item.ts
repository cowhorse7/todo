
import { z } from 'zod';
import { Prisma } from '../../../../../prisma/client';
import { authenticatedProcedure } from '../../trpc';

const createItemInput = z.null();

const createItemOutput = z.void();

export const createItem = authenticatedProcedure
  .meta({ allowedRoles: [] })
  .input(createItemInput)
  .output(createItemOutput)
  .mutation(async (opts) => {
    // Your logic goes here
  });
