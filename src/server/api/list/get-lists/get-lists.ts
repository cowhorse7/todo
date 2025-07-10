
import { z } from 'zod/v4';
import { authenticatedProcedure, publicProcedure } from '../../trpc';
import { listService } from '../../../services/list/list.service';

const getListsInput = z.object({
  userId: z.uuid(),
});

const listSchema = z.object({
  name: z.string()
});

const getListsOutput = z.array(listSchema);

export const getLists = publicProcedure 
  .meta({ allowedRoles: [] })
  .input(getListsInput)
  .output(getListsOutput)
  .mutation(async (opts) => {
    return await listService.getLists(opts.input.userId);
  });
