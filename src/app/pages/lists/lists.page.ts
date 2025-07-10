import { Component, OnInit, signal } from '@angular/core';
import { listService } from '../../../server/services/list/list.service';
import { AuthService } from '@fhss-web-team/frontend-utils';
import { User } from '../../../../prisma/client';

@Component({
  selector: 'app-lists',
  imports: [],
  templateUrl: './lists.page.html',
  styleUrl: './lists.page.scss'
})
export class ListsPage implements OnInit {
  currentUser: User|null = null;
  lists: string[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userId(user => {
      this.currentUser = user;
      lists = signal(listService.getLists());
    })
  }
  
  

  getLists(){}
}
