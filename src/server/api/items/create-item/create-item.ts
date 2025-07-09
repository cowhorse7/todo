
import { z } from 'zod';
import { prisma, Prisma } from '../../../../../prisma/client';
import { authenticatedProcedure, publicProcedure } from '../../trpc';
import { itemService } from '../../../services/item/item.service';

const createItemInput = z.object({
    name: z.string(),
    details: z.string().optional(),
    dueDate: z.date().optional(),
    completed: z.boolean(),
    listId: z.number()
  });

const createItemOutput = z.void();

export const createItem = publicProcedure
  .meta({ allowedRoles: [] })
  .input(createItemInput)
  .output(createItemOutput)
  .mutation(async (opts) => {
    return await itemService.createItem(opts.input.name);
  });
  