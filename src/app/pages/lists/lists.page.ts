import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@fhss-web-team/frontend-utils';
import { List } from '../../../../prisma/client';
import { TRPCService } from '../../trpc.service';

@Component({
  selector: 'app-lists',
  imports: [],
  templateUrl: './lists.page.html',
  styleUrl: './lists.page.scss'
})
export class ListsPage implements OnInit {
  readonly trpc = inject(TRPCService).getClient();
  currentUserId: string|undefined = undefined;
  lists: List[] = [];

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.currentUserId = this.authService.userId();
    console.log('currentUserId at init:', this.currentUserId);

    if(this.currentUserId !== undefined){
      this.currentUserId = (await this.trpc.userManagement.getUser.query({userId: this.currentUserId})).netId;
      this.lists = await this.trpc.list.getLists.mutate({userId: this.currentUserId});
    }
  }
}
