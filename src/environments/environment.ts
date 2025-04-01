// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/* Develop */
/* export const environment = {
  production: true,
  urlServices: 'http://localhost:3000/tiaras/api/',
  nombreCookieToken: 'tiaras_colombia',
  duracionMinutosCookieToken: 60,
  urlAplicacion: 'http://localhost:4200/'
}; */

/* Version 1 */
/* export const environment = {
  production: true,
  urlServices: 'http://localhost:3000/athena/api/v1/',
  nombreCookieToken: 'tiaras_colombia',
  duracionMinutosCookieToken: 60,
  urlAplicacion: 'http://localhost:4200/'
}; */

/* Desplegada en aws */
export const environment = {
  production: true,
  urlServices: '3.148.202.56/tiaras/api/v1',
  nombreCookieToken: 'tiaras_colombia',
  duracionMinutosCookieToken: 60,
  urlAplicacion: 'https://tiaras.pages.dev/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
