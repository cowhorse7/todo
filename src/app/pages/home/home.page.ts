import { Component, inject, signal } from '@angular/core';
import {
  FhssTableComponent,
  makeTableConfig,
  trpcResource,
} from '@fhss-web-team/frontend-utils';
import { UserTableComponent } from '../../components/user-management/user-table/user-table.component';
import { TRPCService } from '../../trpc.service';
import { FormsModule } from '@angular/forms';
import { TRPCProcedureOptions } from '@trpc/client';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  readonly trpc = inject(TRPCService).getClient();


}
