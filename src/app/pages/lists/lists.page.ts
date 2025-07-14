import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@fhss-web-team/frontend-utils';
import { Item, Prisma } from '../../../../prisma/client';
import { TRPCService } from '../../trpc.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type List = Prisma.ListGetPayload<{
  include: {items: true};
}>;

@Component({
  selector: 'app-lists',
  imports: [MatCheckboxModule, FormsModule, CommonModule],
  templateUrl: './lists.page.html',
  styleUrl: './lists.page.scss'
})
export class ListsPage implements OnInit {
  readonly trpc = inject(TRPCService).getClient();
  currentUserId: string|undefined = undefined;
  lists: List[] = [];
  activeLists: Set<number> = new Set();

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.currentUserId = this.authService.userId();

    if(this.currentUserId !== undefined){
      this.lists = await this.trpc.list.getLists.mutate();
    }
  }

  toggleList(listId: number): void {
    if(this.isListOpen(listId)) {
      this.activeLists.delete(listId);
    } else {
      this.activeLists.add(listId);
    }
  }

  isListOpen(listId:number): boolean {
    return this.activeLists.has(listId);
  }

  onItemCheckChange(item: Item, newCompletedValue: boolean){
    item.completed = newCompletedValue;
    //add in trpc call to update item
  }
}
