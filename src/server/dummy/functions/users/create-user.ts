import {
  makeDummy,
  byuAccountService,
  keycloakApi,
} from '@fhss-web-team/backend-utils';
import z from 'zod/v4';
import { defaultRole } from '../../../../roles';
import { userService } from '../../../services/user/user';

export const createUser = makeDummy({
  name: 'Create user',
  description: 'Creates a user from a netId',
  inputSchema: z.object({ netId: z.string() }),
  handler: async (data) => {
    const acct = (await byuAccountService.getAccountsByNetId(data.netId))[0];
    if (!acct) throw new Error('user not found');
    const role = await keycloakApi.getAppRole(defaultRole);
    if (!role) throw new Error('role not found');
    const user = await userService.createUser(acct, role);
    return user;
  },
});
