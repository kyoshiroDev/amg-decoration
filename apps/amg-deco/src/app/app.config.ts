import { type ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { SupabaseProjectsGateway } from './features/realisations/infra/supabase-projects.gateway';
import { PROJECTS_GATEWAY } from './features/realisations/application/tokens';
import { SupabaseServicesGateway } from './features/services/infra/supabase-services.gateway';
import { SERVICES_GATEWAY } from './features/services/application/tokens';
import { SupabaseAvisClientGateway } from './features/home/infra/supabase-avis-client.gateway';
import { AVIS_CLIENT_GATEWAY } from './features/home/application/tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    { provide: PROJECTS_GATEWAY, useClass: SupabaseProjectsGateway },
    { provide: SERVICES_GATEWAY, useClass: SupabaseServicesGateway },
    { provide: AVIS_CLIENT_GATEWAY, useClass: SupabaseAvisClientGateway },
  ],
};
