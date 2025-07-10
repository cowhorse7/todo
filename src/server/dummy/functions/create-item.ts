import { DummyFunction } from "@fhss-web-team/backend-utils";
import z from "zod/v4";
import { itemService } from "../../services/item/item.service";

const inputSchema = z.object({ 
  name: z.string(),
  details: z.string().nullable(),
  dueDate: z.preprocess(
    (val) => typeof val === 'string' && val !== '' ? new Date(val) : null,
    z.date().nullable()
  ),
  completed: z.preprocess(
    (val) => {
      if (val === 'true' || val === true) return true;
      if (val === 'false' || val === false) return false;
      return undefined;
    },
    z.boolean()
  ),
  listId: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.trim() !== '') return parseInt(val, 10);
      return undefined;
    },
    z.number()
  ),
});

export const createItem: DummyFunction<typeof inputSchema> = {
  name: "Create item",
  description: "create a to-do item",
  inputSchema,
  handler: async (data: z.infer<typeof inputSchema>) => {
    return await itemService.createItem(data);
  },
};