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

    if(this.currentUserId !== undefined){
      this.lists = await this.trpc.list.getLists.mutate();
    }
  }
}
