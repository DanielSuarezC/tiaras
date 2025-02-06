import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // Asegúrate de instalar ngx-cookie-service
import { environment } from '../../../../../../environments/environment';
import { MensajeService } from '../../../mensaje/mensaje.service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const mensaje = inject(MensajeService);

  // Verificar si el token existe en las cookies
  const token = cookieService.get(environment.nombreCookieToken); 
  if (token) {
    // Opcional: Agrega validación adicional del token (por ejemplo, verificar expiración)
    return true; // Permitir acceso
  } else {
    // Redirigir al login si no está autenticado
    mensaje.showMessage('Advertencia!','Debes iniciar sesión para acceder a esta página', 'warning');
    router.navigate(['']);
    return false;
  }
};

