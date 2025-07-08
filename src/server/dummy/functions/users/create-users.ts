import {
  byuAccountService,
  keycloakApi,
  makeDummy,
} from '@fhss-web-team/backend-utils';
import { defaultRole } from '../../../../roles';
import { userService } from '../../../services/user/user';

export const createUsers = makeDummy({
  name: 'Create users',
  description: 'Creates a bunch of users',
  handler: async () => {
    const netIds = ['dmorais']; // Add some netIDs here
    const accts = await byuAccountService.getAccountsByNetId(netIds);
    const role = await keycloakApi.getAppRole(defaultRole);
    if (!role) throw new Error('role not found');
    const users = accts.map((acct) => userService.createUser(acct, role));
    return await Promise.all(users);
  },
});
