import { Component, OnInit } from '@angular/core';
import { listService } from '../../../server/services/list/list.service';
import { AuthService } from '@fhss-web-team/frontend-utils';
import { List } from '../../../../prisma/client';
import { userService } from '../../../server/services/user/user';

@Component({
  selector: 'app-lists',
  imports: [],
  templateUrl: './lists.page.html',
  styleUrl: './lists.page.scss'
})
export class ListsPage implements OnInit {
  currentUserId: string|undefined = undefined;
  lists: List[] = [];

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.currentUserId = this.authService.userId();
    if(this.currentUserId !== undefined){
      this.currentUserId = await userService.getNetIdByUserId(this.currentUserId);
      this.lists = await listService.getLists(this.currentUserId);
    }
  }
}
