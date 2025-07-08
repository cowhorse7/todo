import Keycloak, {  } from 'keycloak-js';
import {
  EnvironmentInjector,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer,
  Provider,
  runInInjectionContext,
} from '@angular/core';
import {
  AutoRefreshTokenService,
  createKeycloakSignal,
  KEYCLOAK_EVENT_SIGNAL,
  UserActivityService,
  withAutoRefreshToken,
} from 'keycloak-angular';
import { isPlatformBrowser } from '@angular/common';

const provideKeycloakInAppInitializer = (
  keycloak: Keycloak,
): EnvironmentProviders | Provider[] => {
  const features = [
    withAutoRefreshToken({
      onInactivityTimeout: 'login',
      sessionTimeout: Infinity,
    }),
  ];

  return provideAppInitializer(async () => {
    const platform = inject(PLATFORM_ID);

    // only init keycloak in the browser
    if (isPlatformBrowser(platform)) {
      const injector = inject(EnvironmentInjector);
      runInInjectionContext(injector, () =>
        features.forEach((feature) => feature.configure()),
      );

      await keycloak
        .init({
          responseMode: 'query',
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            window.location.origin + '/silent-check-sso.html',
        })
        .catch((error) =>
          console.error('Keycloak initialization failed', error),
        );
    }
  });
};

export function provideKeycloakSSR(): EnvironmentProviders {
  const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'starter',
    clientId: 'frontend',
  });

  const providers = [AutoRefreshTokenService, UserActivityService];
  const keycloakSignal = createKeycloakSignal(keycloak);

  return makeEnvironmentProviders([
    {
      provide: KEYCLOAK_EVENT_SIGNAL,
      useValue: keycloakSignal,
    },
    {
      provide: Keycloak,
      useValue: keycloak,
    },
    ...providers,
    provideKeycloakInAppInitializer(keycloak),
  ]);
}
