import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // Asegúrate de instalar ngx-cookie-service
import { environment } from '../../../../../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  // Verificar si el token existe en las cookies
  const token = cookieService.get(environment.nombreCookieToken); // Cambia 'jwt' por el nombre de tu cookie
  if (token) {
    // Opcional: Agrega validación adicional del token (por ejemplo, verificar expiración)
    return true; // Permitir acceso
  } else {
    // Redirigir al login si no está autenticado
    router.navigate(['']);
    return false;
  }
};

