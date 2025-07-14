
import { z } from 'zod/v4';
import { authenticatedProcedure } from '../../trpc';
import { listService } from '../../../services/list/list.service';

const deleteListInput = z.object({
  listId: z.number()
});

const deleteListOutput = z.void();

export const deleteList = authenticatedProcedure
  .meta({ allowedRoles: ['user'] })
  .input(deleteListInput)
  .output(deleteListOutput)
  .mutation(async (opts) => {
    await listService.deleteList(opts.input.listId);
  });
