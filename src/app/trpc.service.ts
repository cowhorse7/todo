import { inject, Injectable } from '@angular/core';
import { createTRPCClient, httpLink } from '@trpc/client';
import type { AppRouter } from '../server';
import SuperJSON from 'superjson';
import { AuthService } from '@fhss-web-team/frontend-utils';

@Injectable({
  providedIn: 'root',
})
export class TRPCService {
  private auth = inject(AuthService);

  private client = createTRPCClient<AppRouter>({
    links: [
      httpLink({
        url: `${window.location.origin}/api`,
        transformer: SuperJSON,
        headers: () => {
          return {
            Authorization: this.auth.bearerToken(),
          };
        },
      }),
    ],
  });

  getClient() {
    return this.client;
  }
}
