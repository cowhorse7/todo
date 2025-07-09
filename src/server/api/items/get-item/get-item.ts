import { z } from 'zod';
import { prisma, Prisma } from '../../../../../prisma/client';
import { authenticatedProcedure, publicProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

const getItemInput = z.object({
  id: z.number(),
});

const getItemOutput = z.object({
  id: z.number(),
  name: z.string(),
  details: z.string().nullable(),
  dueDate: z.date().nullable(),
  completed: z.boolean(),
});

export const getItem = publicProcedure
  .meta({ allowedRoles: [] })
  .input(getItemInput)
  .output(getItemOutput)
  .mutation(async (opts) => {
    const item = await prisma.item.findUnique({ where: { id: opts.input.id } });
    if (!item) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    return item;
  });
