
import { z } from 'zod/v4';
import { authenticatedProcedure, publicProcedure } from '../../trpc';

const createListInput = z.object({
  userId: z.uuid(),
  name: z.string(),
});

const createListOutput = z.void();

export const createList = publicProcedure
  .meta({ allowedRoles: [] })
  .input(createListInput)
  .output(createListOutput)
  .mutation(async (opts) => {
    // Your logic goes here
  });
