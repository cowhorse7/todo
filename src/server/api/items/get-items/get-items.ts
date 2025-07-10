import { z } from 'zod/v4';
import { authenticatedProcedure, publicProcedure } from '../../trpc';
import { itemService } from '../../../services/item/item.service';

const getItemsInput = z.object({
  listId: z.number(),
});

const itemSchema = z.object({
  name: z.string(),
  details: z.string().nullable(),
  completed: z.boolean(),
  dueDate: z.date().nullable(),
});

const getItemsOutput = z.array(itemSchema);

export const getItems = publicProcedure
  .meta({ allowedRoles: [] })
  .input(getItemsInput)
  .output(getItemsOutput)
  .mutation(async (opts) => {
    return await itemService.getItems(opts.input.listId);
  });
