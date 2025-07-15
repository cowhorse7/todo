import { Component, inject } from '@angular/core';
import { TRPCService } from '../../trpc.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-list',
  imports: [MatDialogModule],
  templateUrl: './delete-list.component.html',
  styleUrl: './delete-list.component.scss'
})
export class DeleteListComponent {
  readonly trpc = inject(TRPCService).getClient();
  data = inject<{ listId: number }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DeleteListComponent>);
  
  async deleteList(){
    try{
    await this.trpc.list.deleteList.mutate({listId: this.data.listId});
    }catch(err){
      console.log("an error occurred when attempting to delete the list");
      throw err;
    }
    this.dialogRef.close("deleted");
  }
}
