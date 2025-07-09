import { Injectable } from '@angular/core';
import { Item, prisma } from '../../../../prisma/client';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() { }

  public async createItem(
    name: string
  ): Promise<Item> {

    return await prisma.item.create({
      data: {
        name: name,

      },
    });
  }
}
export const itemService = new ItemService();