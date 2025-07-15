import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TRPCService } from '../../trpc.service';

@Component({
  selector: 'app-add-task',
  imports: [MatDialogModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  data = inject<{ itemId: number | undefined }>(MAT_DIALOG_DATA);
  readonly trpc = inject(TRPCService).getClient();
  // readonly itemId: number | undefined = this.data.itemId;
  readonly dialogRef = inject(MatDialogRef<AddTaskComponent>);
}
