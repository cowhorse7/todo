
import { z } from 'zod/v4';
import { authenticatedProcedure, publicProcedure } from '../../trpc';
import { listService } from '../../../services/list/list.service';

const createListInput = z.object({
  userId: z.string(),
  name: z.string(),
});

const createListOutput = z.void();

export const createList = publicProcedure
  .meta({ allowedRoles: [] })
  .input(createListInput)
  .output(createListOutput)
  .mutation(async (opts) => {
    await listService.createList(opts.input);
  });
