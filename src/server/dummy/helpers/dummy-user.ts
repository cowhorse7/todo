import { ByuAccountType, User } from '../../../../prisma/client';
import { faker } from '@faker-js/faker';
import { generateDummyAccountData } from '@fhss-web-team/backend-utils';

/**
 * Generates a dummy user object for testing or seeding purposes.
 *
 * @param accountType - The type of BYU account to generate. Defaults to `ByuAccountType.Student`.
 * @returns A `User` object populated with randomized and dummy data.
 */
export function generateDummyUserData(accountType: ByuAccountType = ByuAccountType.Student): User {
  const acct = generateDummyAccountData(accountType)
  return {
    ...acct,
    id: faker.string.uuid(),
    byuId: acct.byuId ?? null,
    workerId: acct.byuId ?? null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    accountType,
    keycloakId: faker.string.uuid(),
    lastLogin: faker.date.past()
  };
}

