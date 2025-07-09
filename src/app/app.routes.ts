import { Routes } from '@angular/router';
import {
  AuthCallbackPage,
  AuthErrorPage,
  ForbiddenPage,
  NotFoundPage,
} from '@fhss-web-team/frontend-utils';
import { ByuLayout } from './layouts/byu/byu.layout';
import { HomePage } from './pages/home/home.page';
import { ListsPage } from './pages/lists/lists.page';

export const routes: Routes = [
  { path: 'forbidden', component: ForbiddenPage },
  { path: 'auth-callback', component: AuthCallbackPage },
  { path: 'auth-error', component: AuthErrorPage },
  { path: '', component: ByuLayout, 
    children: [
      {path: '', component: HomePage},
      {path: 'lists', component: ListsPage}
    ], 
  },
  { path: '**', component: NotFoundPage },
];
