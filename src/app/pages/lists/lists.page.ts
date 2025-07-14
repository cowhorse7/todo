import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@fhss-web-team/frontend-utils';
import { Item, Prisma } from '../../../../prisma/client';
import { TRPCService } from '../../trpc.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

type List = Prisma.ListGetPayload<{
  include: {items: true};
}>;

@Component({
  selector: 'app-lists',
  imports: [MatCheckboxModule, FormsModule, CommonModule, MatIconModule, MatFormField, MatInputModule],
  templateUrl: './lists.page.html',
  styleUrl: './lists.page.scss'
})
export class ListsPage implements OnInit {
  readonly trpc = inject(TRPCService).getClient();
  currentUserId: string|undefined = undefined;
  lists: List[] = [];
  activeLists: Set<number> = new Set();
  editingListId: number | null = null;

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.currentUserId = this.authService.userId();

    if(this.currentUserId !== undefined){
      this.lists = await this.trpc.list.getLists.mutate();
    }
  }

  toggleEditing(listId: number){
    this.editingListId = this.editingListId === listId ? null : listId;
  }
  
  async editList(listId: number, newName: string){
    await this.trpc.list.updateList.mutate({listId: listId, name: newName});
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
    this.trpc.items.updateItem.mutate({itemId: item.id, completed: newCompletedValue});
  }

  //To-Dos: add task, edit task (details/name), delete task, add list, delete list
}
