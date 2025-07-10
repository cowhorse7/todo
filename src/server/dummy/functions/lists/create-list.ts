import { DummyFunction } from "@fhss-web-team/backend-utils";
import z from "zod/v4";
import { listService } from "../../../services/list/list.service";

const inputSchema = z.object({ 
  name: z.string(),
  userId: z.string(),
});

export const createList: DummyFunction<typeof inputSchema> = {
  name: "Create list",
  description: "create a list to store to-dos",
  inputSchema,
  handler: async (data: z.infer<typeof inputSchema>) => {
    return await listService.createList(data);
  },
};