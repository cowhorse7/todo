import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { trpcResource } from '@fhss-web-team/frontend-utils';
import { TRPCService } from '../../../trpc.service';

@Component({
  selector: 'fhss-user-edit',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent {
  readonly trpc = inject(TRPCService).getClient();
  readonly dialogRef = inject(MatDialogRef<UserEditComponent>);
  readonly userId: string | undefined = inject(MAT_DIALOG_DATA);

  userResource = trpcResource(
    this.trpc.userManagement.getUser.query,
    () => ({ userId: this.userId ?? '' }),
    { autoRefresh: true },
  );

  user = computed(() => this.userResource.value());

  displayName = computed(() => {
    if (this.userResource.isLoading()) {
      return 'loading...';
    }
    return this.user()
      ? `${this.user()?.preferredFirstName} ${this.user()?.preferredLastName}`
      : 'User not Found';
  });

  fullName = computed(() => {
    const user = this.user()
    if(!user) return '';
    return `${user.firstName} ${user.middleName ?? ''} ${user.lastName} ${user.suffix ?? ''}`
  })
}
