import { createList } from './list/create-list/create-list'
import { getLists } from './list/get-lists/get-lists'
import { updateItem } from './items/update-item/update-item'
import { deleteItem } from './items/delete-item/delete-item'
import { createItem } from './items/create-item/create-item'
import { getItem } from './items/get-item/get-item'
import { getItems } from './items/get-items/get-items'
import { router } from './trpc';
import { createUser } from './user-management/create-user/create-user';
import { deleteUser } from './user-management/delete-user/delete-user';
import { getUser } from './user-management/get-user/get-user';
import { getUsers } from './user-management/get-users/get-users';
import { giveRoles } from './user-management/give-roles/give-roles';

export const appRouter = router({
  list: {
    getLists,
    createList,
  },
  items: {
    getItems,
    getItem,
    createItem,
    deleteItem,
    updateItem,
  },
  userManagement: {
    createUser,
    deleteUser,
    giveRoles,
    getUser,
    getUsers,
  },
});
