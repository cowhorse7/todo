import { Injectable } from '@angular/core';
import { Item, prisma } from '../../../../prisma/client';

@Injectable({
  providedIn: 'root'
})
class ItemService {

  constructor() { }

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
}
export const itemService = new ItemService();