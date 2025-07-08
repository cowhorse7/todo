import { Routes } from '@angular/router';
import {
  AuthCallbackPage,
  AuthErrorPage,
  ForbiddenPage,
  NotFoundPage,
} from '@fhss-web-team/frontend-utils';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  { path: 'forbidden', component: ForbiddenPage },
  { path: 'auth-callback', component: AuthCallbackPage },
  { path: 'auth-error', component: AuthErrorPage },
  { path: '', pathMatch: 'full', component: HomePage }, // Change this to be the home page
  { path: '**', component: NotFoundPage },
];
