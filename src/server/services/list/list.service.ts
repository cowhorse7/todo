import { Injectable } from '@angular/core';
import { List, prisma } from '../../../../prisma/client';

@Injectable({
  providedIn: 'root'
})
class ListService {

  public async getLists(){
    return await prisma.list.findMany({
      orderBy:{name: 'asc'},
      
    });
  }

  public async createList( data: {
    name: string
  }): Promise<List> {
    return await prisma.list.create({ data });
  }
}
export const listService = new ListService();
