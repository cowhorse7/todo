import { z } from 'zod/v4';
import { authenticatedProcedure } from '../../trpc';
import { itemService } from '../../../services/item/item.service';

const getItemInput = z.object({
  id: z.number(),
});

const getItemOutput = z.object({
  id: z.number(),
  name: z.string(),
  details: z.string().nullable(),
  dueDate: z.date().nullable(),
  completed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  listId: z.number(),
});

export const getItem = authenticatedProcedure
  .meta({ allowedRoles: ['user'] })
  .input(getItemInput)
  .output(getItemOutput)
  .mutation(async (opts) => {
    return await itemService.getItem(opts.input.id);
  });
