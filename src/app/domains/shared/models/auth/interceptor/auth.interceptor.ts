import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment }  from '../../../../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  /* Obtener el token de la cookie */
  const token = cookieService.get(environment.nombreCookieToken);

  if (!token) {
    router.navigate(['']);
    return next(req); // Puede ser `EMPTY` si decides no continuar sin token.
  }

  /* Actualizar la expiración del token en la cookie */
  // const fecha = new Date();
  // fecha.setMinutes(fecha.getMinutes() + environment.duracionMinutosCookieToken);
  // cookieService.set(environment.nombreCookieToken, token, fecha);

  /* Agregar el token a los headers de la solicitud */
  const modifiedRequest = req.clone({
    headers: req.headers.set('token', token),
  });

  return next(modifiedRequest);
};
