
import { z } from 'zod/v4';
import { authenticatedProcedure } from '../../trpc';
import { listService } from '../../../services/list/list.service';

const updateListInput = z.object({
  listId: z.number(),
  name: z.string()
});

const updateListOutput = z.void();

export const updateList = authenticatedProcedure
  .meta({ allowedRoles: ['user'] })
  .input(updateListInput)
  .output(updateListOutput)
  .mutation(async (opts) => {
    await listService.updateList(opts.input);
  });
