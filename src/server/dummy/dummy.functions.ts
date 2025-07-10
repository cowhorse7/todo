import { deleteItems } from "./functions/delete-items";
import { createList } from "./functions/create-list";
import { createItem } from "./functions/create-item";
import { createUser } from "./functions/users/create-user.js";
import { createUsers } from "./functions/users/create-users.js";
import { deleteUsers } from "./functions/users/delete-users.js";
import type { DummyFunction } from '@fhss-web-team/backend-utils';

export const dummyFunctions: DummyFunction[] = [
	deleteUsers,
	createUsers,
	createUser,
	createItem,
	createList,
	deleteItems,
];