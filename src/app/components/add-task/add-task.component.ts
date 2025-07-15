import { Component, inject, linkedSignal, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TRPCService } from '../../trpc.service';
import { Item } from '../../../../prisma/client';

@Component({
  selector: 'app-add-task',
  imports: [MatDialogModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit{
  data = inject<{ listId: number, itemId: number | undefined }>(MAT_DIALOG_DATA);
  readonly trpc = inject(TRPCService).getClient();
  // readonly itemId: number | undefined = this.data.itemId;
  readonly dialogRef = inject(MatDialogRef<AddTaskComponent>);
  item: Item | undefined; 

  async ngOnInit(){
    this.item = await this.getItem()
  }

  async getItem(): Promise<Item | undefined>{
    if(this.data.itemId == undefined){
      return undefined;
    }
    else{
      return await this.trpc.items.getItem.mutate({id: this.data.itemId});
    }
  }

  name = linkedSignal(() => this.item?.name ?? '');
  details = linkedSignal(() => this.item?.details ?? '');
  due = linkedSignal(() => this.item?.dueDate ?? null);
  completed = linkedSignal(() => this.item?.completed ?? false);
  
  async addTask(){
    try{
      await this.trpc.items.createItem.mutate({name: this.name(), completed: this.completed(), details: this.details(), dueDate: this.due(), listId: this.data.listId});
    }catch(err){
      throw err;
    }
    this.dialogRef.close("created");
  }

  async editTask(){
    try{
      await this.trpc.items.updateItem.mutate({name: this.name(), completed: this.completed(), details: this.details(), dueDate: this.due(), listId: this.data.listId});
    }catch(err){
      throw err;
    }
    this.dialogRef.close("created");
  }
}
