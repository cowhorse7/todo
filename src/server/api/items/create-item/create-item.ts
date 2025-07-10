
import { z } from 'zod';
import { authenticatedProcedure, publicProcedure } from '../../trpc';
import { itemService } from '../../../services/item/item.service';

const createItemInput = z.object({
    name: z.string(),
    details: z.string().nullable(),
    dueDate: z.date().nullable(),
    completed: z.boolean(),
    listId: z.number()
  });

const createItemOutput = z.void();

export const createItem = publicProcedure
  .meta({ allowedRoles: [] })
  .input(createItemInput)
  .output(createItemOutput)
  .mutation(async (opts) => {
    await itemService.createItem(opts.input);
  });
  