import { Injectable } from '@angular/core';
import { List, prisma } from '../../../../prisma/client';

@Injectable({
  providedIn: 'root'
})
class ListService {

  public async getLists(userId: string){
    return await prisma.list.findMany({
      where: {userId: userId},
      orderBy:{name: 'asc'},
      include:{items: true},
    });
  }

  public async createList( data: {
    name: string,
    userId: string
  }): Promise<List> {
    return await prisma.list.create({ data });
  }

  public async deleteList(listId: number): Promise<List> {
    const list = await prisma.list.delete({ where: { id: listId } });
    return list;
  }

  public async updateList(data: {
    listId: number,
    name: string,
  }){
    return await prisma.list.update({
      where: {id: data.listId}, 
      data:{
        name: data.name,
      }
    });
  }
}
export const listService = new ListService();
