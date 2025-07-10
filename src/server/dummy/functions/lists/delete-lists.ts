import { DummyFunction } from "@fhss-web-team/backend-utils";
import { prisma } from "../../../../../prisma/client";
import { listService } from "../../../services/list/list.service";

export const deleteLists: DummyFunction = {
  name: "Delete lists",
  description: "Deletes all lists",
  handler: async () => {
        const lists = await prisma.list.findMany({});
        const res = lists.map(list => listService.deleteList(list.id));
        return await Promise.all(res);
      },
};