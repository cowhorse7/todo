import { z } from 'zod/v4';
import { authenticatedProcedure, publicProcedure } from '../../trpc';
import { ByuAccountType, prisma } from '../../../../../prisma/client';
import {
  createTableQueryInputSchema,
  createTableQueryOutputSchema,
  keycloakApi,
  retrieveTableData,
} from '@fhss-web-team/backend-utils';

const getUsersInput = createTableQueryInputSchema(['netId', 'preferredName'], {
  accountTypes: z.array(z.literal(Object.values(ByuAccountType))),
  createdAt: z.object({
    after: z.date().optional(),
    before: z.date().optional(),
  }),
});

const getUsersOutput = createTableQueryOutputSchema({
  netId: z.string(),
  accountType: z.string(),
  preferredName: z.string(),
  createdAt: z.string(),
  roles: z.string(),
});

export const getUsers = publicProcedure
  .meta({ allowedRoles: ['admin'] })
  .input(getUsersInput)
  .output(getUsersOutput)
  .query(async (opts) => {
    const input = opts.input;

    const { totalCount, data: users } = await retrieveTableData(
      prisma.user,
      input,
      {
        args: {
          where: {
            accountType: input.accountTypes.length
              ? { in: input.accountTypes }
              : undefined,
            createdAt: {
              gte: input.createdAt.after,
              lte: input.createdAt.before
            }
          },
        },
        searchableFields: [
          'netId',
          'byuId',
          'firstName',
          'preferredFirstName',
          'lastName',
          'preferredLastName',
          'middleName',
        ],
        sortPropertySubstitutions: {
          preferredName: 'preferredFirstName',
        },
        filterPropertySubstitutions: {
          preferredName: [
            'preferredFirstName',
            'preferredLastName',
            'firstName',
            'lastName',
          ],
        },
      },
    );

    // Formats user data and requests keycloak roles
    const userData = users.map(async (user) => ({
      id: user.id,
      netId: user.netId,
      accountType: user.accountType,
      preferredName: `${user.preferredFirstName} ${user.preferredLastName}`,
      createdAt: `${user.createdAt.toDateString()} ${user.createdAt.toLocaleTimeString('en-US')}`,
      roles: (await keycloakApi.getUserAppRoles(user.keycloakId)).map((role) => role.name).join(', '),
    }));

    return {
      totalCount,
      data: await Promise.all(userData),
    };
  });
