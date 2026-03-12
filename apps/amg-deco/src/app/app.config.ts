
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling, withPreloading, PreloadAllModules } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@amg/data-access';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { SupabaseProjectsGateway } from './features/realisations/infra/supabase-projects.gateway';
import { PROJECTS_GATEWAY } from './features/realisations/application/tokens';
import { SupabaseServicesGateway } from './features/services/infra/supabase-services.gateway';
import { SERVICES_GATEWAY } from './features/services/application/tokens';
import { SupabaseTestimonialsGateway } from './features/home/infra/supabase-testimonials.gateway';
import { TESTIMONIALS_GATEWAY } from './features/home/application/tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    { provide: SUPABASE_URL, useValue: environment.supabaseUrl },
    { provide: SUPABASE_ANON_KEY, useValue: environment.supabaseAnonKey },
    { provide: PROJECTS_GATEWAY, useClass: SupabaseProjectsGateway },
    { provide: SERVICES_GATEWAY, useClass: SupabaseServicesGateway },
    { provide: TESTIMONIALS_GATEWAY, useClass: SupabaseTestimonialsGateway },
  ],
};
