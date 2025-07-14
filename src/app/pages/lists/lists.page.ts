import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@fhss-web-team/frontend-utils';
import { Prisma } from '../../../../prisma/client';
import { TRPCService } from '../../trpc.service';

type List = Prisma.ListGetPayload<{
  include: {items: true};
}>;

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
  activeLists: Set<number> = new Set();

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.currentUserId = this.authService.userId();

    if(this.currentUserId !== undefined){
      this.lists = await this.trpc.list.getLists.mutate();
    }
  }

  toggleList(listId: number): void {
    if(this.isListOpen(listId)) {
      this.activeLists.delete(listId);
    } else {
      this.activeLists.add(listId);
    }
  }

  isListOpen(listId:number): boolean {
    return this.activeLists.has(listId);
  }
}
