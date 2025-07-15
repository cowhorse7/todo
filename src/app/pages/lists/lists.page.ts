import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '@fhss-web-team/frontend-utils';
import { Item, Prisma } from '../../../../prisma/client';
import { TRPCService } from '../../trpc.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddTaskComponent } from '../../components/add-task/add-task.component';
import { DeleteListComponent } from '../../components/delete-list/delete-list.component';

type List = Prisma.ListGetPayload<{
  include: {items: true};
}>;

@Component({
  selector: 'app-lists',
  imports: [MatCheckboxModule, FormsModule, CommonModule, MatIconModule, MatFormField, MatInputModule, MatLabel],
  templateUrl: './lists.page.html',
  styleUrl: './lists.page.scss'
})
export class ListsPage implements OnInit {
  readonly trpc = inject(TRPCService).getClient();
  currentUserId: string|undefined = undefined;
  lists: List[] = [];
  activeLists: Set<number> = new Set();
  editingListId: number | null = null;
  addingList: boolean = false;
  newListName = signal<string>("");
  readonly dialog = inject(MatDialog);

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.currentUserId = this.authService.userId();

    if(this.currentUserId !== undefined){
      await this.getLists();
    }
  }

  async getLists(){
    this.lists = await this.trpc.list.getLists.mutate();
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

  async onItemCheckChange(item: Item, newCompletedValue: boolean){
    item.completed = newCompletedValue;
    await this.trpc.items.updateItem.mutate({itemId: item.id, completed: newCompletedValue});
  }

  toggleAddingList(){
    if(this.addingList === false){
      this.addingList = true;
    } else{
      this.addingList = false;
    }
  }

  async deleteTask(itemId: number){
    await this.trpc.items.deleteItem.mutate({id: itemId});
  }

  async addList(){
    await this.trpc.list.createList.mutate({name: this.newListName()});
    await this.getLists();
  }


  openTaskModal(itemId?: number){
    this.dialog.open(AddTaskComponent, {
      data: {itemId: itemId}
    });
  }

  openDeleteModal(listId: number){
    const dialogRef = this.dialog.open(DeleteListComponent, {
      data: {listId: listId}
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if(result){
        await this.getLists();
      }
    })
  }
}
