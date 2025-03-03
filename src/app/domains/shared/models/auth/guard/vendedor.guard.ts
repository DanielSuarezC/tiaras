import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../environments/environment';
import { MensajeService } from '../../../mensaje/mensaje.service';
import { paylod } from '../../paylod';
import { jwtDecode } from 'jwt-decode';

export const vendedorGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const mensaje = inject(MensajeService);

  const token = cookieService.get(environment.nombreCookieToken);

  if (!token) {
    mensaje.showMessage('Advertencia', 'Debes iniciar sesión para acceder a esta página', 'warning');
    router.navigate(['']);
    return false;
  }

  let payload: paylod | undefined;

  try {
    payload = jwtDecode(token);
  } catch (error) {
    console.error('Error decodificando el token:', error);
    cookieService.delete(environment.nombreCookieToken);
    mensaje.showMessage('Error', 'Token inválido, inicia sesión nuevamente', 'error');
    router.navigate(['']);
    return false;
  }

  if (state.url === '/vendedor/orders-history') {
    return true;
  } else if (payload?.rol !== 'VENDEDOR') {
    mensaje.showMessage('Advertencia', 'Sólo el vendedor puede acceder a esta página', 'warning');
    return false;
  }
  return true;
};
