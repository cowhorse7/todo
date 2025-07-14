import { Injectable } from '@angular/core';
import { Item, prisma } from '../../../../prisma/client';
import { TRPCError } from '@trpc/server';

@Injectable({
  providedIn: 'root'
})
class ItemService {

  public async getItem(itemId: number){
    const item = await prisma.item.findUnique({ where: { id: itemId } });
        if (!item) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        return item;
  }

  public async getItems(listId: number){
    return await prisma.item.findMany({
      where: {listId: listId},
      orderBy:{dueDate: 'asc'},
    });
  }

  public async createItem( data: {
    name: string,
    details: string | null,
    dueDate: Date | null,
    completed: boolean,
    listId: number
  }): Promise<Item> {

    return await prisma.item.create({ data });
  }

  public async deleteItem(itemId: number): Promise<Item> {
      const item = await prisma.item.delete({ where: { id: itemId } });
      return item;
    }

  public async updateItem(data: {
    itemId: number,
    name?: string,
    details?: string,
    dueDate?: Date,
    completed?: boolean,
    listId?: number
  }){
    return await prisma.item.update({
      where: {id: data.itemId}, 
      data:{
        name: data?.name,
        details: data?.details,
        dueDate: data?.dueDate,
        completed: data?.completed,
        listId: data?.listId,
      }
    });
  }
}
export const itemService = new ItemService();