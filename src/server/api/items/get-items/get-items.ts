import { z } from 'zod/v4';
import { prisma, Prisma } from '../../../../../prisma/client';
import { authenticatedProcedure, publicProcedure } from '../../trpc';
import {
  createTableQueryInputSchema,
  createTableQueryOutputSchema,
  retrieveTableData,
} from '@fhss-web-team/backend-utils';

const getItemsInput = createTableQueryInputSchema([], {});

const getItemsOutput = createTableQueryOutputSchema({
  name: z.string(),
  details: z.string(),
  completed: z.string(),
  dueDate: z.string(),
});

export const getItems = publicProcedure
  .meta({ allowedRoles: [] })
  .input(getItemsInput)
  .output(getItemsOutput)
  .mutation(async (opts) => {
    const { totalCount, data } = await retrieveTableData(
      prisma.item,
      opts.input,
      {searchableFields: ['name']}
    );
    return {
      totalCount,
      data: data.map((item) => ({
        id: item.id,
        name: item.name,
        details: item.details,
        completed: item.completed.toString(),
        dueDate: item.dueDate.toDateString()
      })),
    };
  });
