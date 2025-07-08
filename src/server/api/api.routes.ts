import { router } from './trpc';
import { createUser } from './user-management/create-user/create-user';
import { deleteUser } from './user-management/delete-user/delete-user';
import { getUser } from './user-management/get-user/get-user';
import { getUsers } from './user-management/get-users/get-users';
import { giveRoles } from './user-management/give-roles/give-roles';

export const appRouter = router({
  userManagement: {
    createUser,
    deleteUser,
    giveRoles,
    getUser,
    getUsers,
  },
});
