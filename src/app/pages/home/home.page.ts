import { Component } from '@angular/core';
import { ByuHeaderComponent, HeaderConfig } from '@fhss-web-team/frontend-utils';
import { UserTableComponent } from '../../components/user-management/user-table/user-table.component';

@Component({
  selector: 'app-home',
  imports: [ByuHeaderComponent, UserTableComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  readonly headerConfig: HeaderConfig = {
    title: {
      text: 'Starter App',
      path: ''
    }
  }
}
