import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TRPCService } from '../../trpc.service';
import { Item } from '../../../../prisma/client';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-task',
  imports: [MatDialogModule, MatLabel, MatFormFieldModule, FormsModule, MatInput, MatCheckboxModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit{
  data = inject<{ listId: number, itemId: number | undefined }>(MAT_DIALOG_DATA);
  readonly trpc = inject(TRPCService).getClient();
  readonly dialogRef = inject(MatDialogRef<AddTaskComponent>);
  item: Item | undefined; 
  name = signal<string>('');
  details = signal<string>('');
  due = signal<string | null>(null);
  completed = signal<boolean>(false);

  async ngOnInit(){
    this.item = await this.getItem()
    this.name.set(this.item?.name ?? '');
    this.details.set(this.item?.details ?? '');
    if (this.item?.dueDate) {
      this.due.set(formatDate(this.item.dueDate, 'yyyy-MM-ddTHH:mm', 'en-US'));
    } else {
      this.due.set(null);
    }
    this.completed.set(this.item?.completed ?? false);
  }

  async getItem(): Promise<Item | undefined>{
    if(this.data.itemId == undefined){
      return undefined;
    } else{
      return await this.trpc.items.getItem.mutate({id: this.data.itemId});
    }
  }

  get dueForUpdate(): Date | undefined {
    const value = this.due();
    return value === null ? undefined : new Date(value);
  }
  get dueForNew(): Date | null {
    const value = this.due();
    return value === null ? null : new Date(value);
  } 
  
  async addTask(){
    try{
      await this.trpc.items.createItem.mutate({name: this.name(), completed: this.completed(), details: this.details(), dueDate: this.dueForNew, listId: this.data.listId});
    }catch(err){
      throw err;
    }
    this.dialogRef.close("created");
  }

  async editTask(){
    try{
      await this.trpc.items.updateItem.mutate({itemId: this.item!.id, name: this.name(), completed: this.completed(), details: this.details(), dueDate: this.dueForUpdate, listId: this.data.listId});
    }catch(err){
      throw err;
    }
    this.dialogRef.close("edited");
  }

  submitForm(){
    if(this.data.itemId == undefined){
      this.addTask();
    } else{
      this.editTask();
    }
  }
}
