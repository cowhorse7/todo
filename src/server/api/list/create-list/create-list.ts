
import { z } from 'zod/v4';
import { authenticatedProcedure } from '../../trpc';
import { listService } from '../../../services/list/list.service';

const createListInput = z.object({
  name: z.string(),
});

const createListOutput = z.void();

export const createList = authenticatedProcedure
  .meta({ allowedRoles: ['user'] })
  .input(createListInput)
  .output(createListOutput)
  .mutation(async (opts) => {
    await listService.createList({name: opts.input.name, userId: opts.ctx.user.username});
  });
