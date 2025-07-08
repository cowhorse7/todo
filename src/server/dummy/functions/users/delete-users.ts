import { makeDummy } from '@fhss-web-team/backend-utils';
import { userService } from '../../../services/user/user';
import { prisma } from '../../../../../prisma/client';

export const deleteUsers = makeDummy({
  name: 'Delete users',
  description: 'Deletes all users',
  handler: async () => {
    const users = await prisma.user.findMany({});
    const res = users.map(user => userService.deleteUser(user.id));
    return await Promise.all(res);
  },
});
