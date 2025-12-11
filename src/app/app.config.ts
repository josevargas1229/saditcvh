import { ApplicationConfig, APP_INITIALIZER ,provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptors';
import { errorInterceptor } from './core/interceptors/error.interceptors';
import { AuthService } from './core/services/auth';

function initializeApp(authService: AuthService) {
  return () => authService.checkStatus(); // Retorna una promesa
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]),
      withXsrfConfiguration({
        cookieName: 'x-csrf-token',
        headerName: 'x-csrf-token',
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [AuthService],
    }
  ]
};
