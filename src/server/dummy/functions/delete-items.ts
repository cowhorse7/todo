import { DummyFunction } from "@fhss-web-team/backend-utils";
import { prisma } from "../../../../prisma/client";
import { itemService } from "../../services/item/item.service";

export const deleteItems: DummyFunction = {
  name: "Delete items",
  description: "deletes all items",
  handler: async () => {
      const items = await prisma.item.findMany({});
      const res = items.map(item => itemService.deleteItem(item.id));
      return await Promise.all(res);
    },
};