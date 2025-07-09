import { DummyFunction } from "@fhss-web-team/backend-utils";
import z from "zod/v4";

export const createItem: DummyFunction = {
  name: "Create item",
  description: "create a to-do item",
    inputSchema: z.object({ name: z.string() }),
    handler: async (data) => {
      const acct = (await byuAccountService.getAccountsByNetId(data.netId))[0];
      if (!acct) throw new Error('user not found');
      const user = await itemService.createUser(acct, role);
      return user;
    },
};