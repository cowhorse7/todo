
import { z } from 'zod/v4';
import { authenticatedProcedure } from '../../trpc';
import { itemService } from '../../../services/item/item.service';

const deleteItemInput = z.object({
  id: z.number(),
})

const deleteItemOutput = z.void();

export const deleteItem = authenticatedProcedure
  .meta({ allowedRoles: ['user'] })
  .input(deleteItemInput)
  .output(deleteItemOutput)
  .mutation(async (opts) => {
    await itemService.deleteItem(opts.input.id);
  });
