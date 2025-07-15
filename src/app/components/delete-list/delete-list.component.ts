import { Component, inject } from '@angular/core';
import { TRPCService } from '../../trpc.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-list',
  imports: [],
  templateUrl: './delete-list.component.html',
  styleUrl: './delete-list.component.scss'
})
export class DeleteListComponent {
  readonly trpc = inject(TRPCService).getClient();
  readonly listId: number = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DeleteListComponent>);
  
  async deleteList(){
    await this.trpc.list.deleteList.mutate({listId: this.listId});
    this.dialogRef.close();
  }
}
