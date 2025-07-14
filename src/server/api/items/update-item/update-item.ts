
import { z } from 'zod/v4';
import { authenticatedProcedure } from '../../trpc';
import { itemService } from '../../../services/item/item.service';

const updateItemInput = z.object({
  itemId: z.number(),
    name: z.string().optional(),
    details: z.string().optional(),
    dueDate: z.date().optional(),
    completed: z.boolean().optional(),
    listId: z.number().optional()
  });;

const updateItemOutput = z.void();

export const updateItem = authenticatedProcedure
  .meta({ allowedRoles: [] })
  .input(updateItemInput)
  .output(updateItemOutput)
  .mutation(async (opts) => {
    await itemService.updateItem(opts.input);
  });
