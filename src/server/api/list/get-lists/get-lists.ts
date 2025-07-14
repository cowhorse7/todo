
import { z } from 'zod/v4';
import { authenticatedProcedure } from '../../trpc';
import { listService } from '../../../services/list/list.service';

const getListsInput = z.undefined();

const itemSchema = z.object({
  name: z.string(),
  details: z.string().nullable(),
  completed: z.boolean(),
  dueDate: z.date().nullable(),
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  listId: z.number(),
});

const listSchema = z.object({
  name: z.string(),
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  items: z.array(itemSchema)
});

const getListsOutput = z.array(listSchema);

export const getLists = authenticatedProcedure 
  .meta({ allowedRoles: ['user'] })
  .input(getListsInput)
  .output(getListsOutput)
  .mutation(async (opts) => {
    return await listService.getLists(opts.ctx.user.username);
  });
