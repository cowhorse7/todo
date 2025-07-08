import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { FhssConfig, provideFhss } from '@fhss-web-team/frontend-utils';
import { defaultHomePages } from '../roles';
import { provideKeycloakSSR } from './provide-keycloak';

const fhssConfig: FhssConfig = {
  roleHomePages: defaultHomePages,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFhss(fhssConfig),
    provideKeycloakSSR(),
  ],
};
