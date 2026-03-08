
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling, withPreloading, PreloadAllModules } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@amg/data-access';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
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
  ],
};
