import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BlockUIModule } from 'ng-block-ui';
import { routes } from './app.routes';
import { provideRouter, PreloadAllModules, withComponentInputBinding, withPreloading } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch()),
    importProvidersFrom(BlockUIModule.forRoot({
      message: 'Por favor espere...',
    })) // <-- registro de BlockUI 
  ]
};