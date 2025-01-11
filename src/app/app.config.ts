import { ApplicationConfig } from '@angular/core';
import { provideRouter, PreloadAllModules, withComponentInputBinding, withPreloading } from '@angular/router';

import { provideHttpClient, withFetch} from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)), 
    provideHttpClient(withFetch())]
};
