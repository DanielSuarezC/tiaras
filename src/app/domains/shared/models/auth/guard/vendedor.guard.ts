import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // Asegúrate de instalar ngx-cookie-service
import { environment } from '../../../../../../environments/environment';
import { MensajeService } from '../../../mensaje/mensaje.service';
import { paylod } from '../../paylod';
import { jwtDecode } from 'jwt-decode';

export const vendedorGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const mensaje = inject(MensajeService);

  let payload: paylod | undefined;

  let url = state.url;

  // Verificar si el token existe en las cookies
  const token = cookieService.get(environment.nombreCookieToken);

  // Verificar si el token existe y si el rol es VENDEDOR
  if (token) {
    payload = jwtDecode(token);
    if (payload?.rol === 'VENDEDOR') {
      return true; // Permitir acceso
    } else {
      mensaje.showMessage('Advertencia!', 'Sólo el vendedor puede acceder a esta página', 'warning');
      // router.navigate([url]);
      return false; // No permitir acceso
    }
  } else {
    // Redirigir al login si no está autenticado
    mensaje.showMessage('Advertencia!', 'Debes iniciar sesión para acceder a esta página', 'warning');
    router.navigate(['']);
    return false;
  }
};
