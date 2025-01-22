import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet/>'
  
})
export class AppComponent {
  title = 'tiaras';
  
  
  baseUrl = environment.urlAplicacion;
  cookieService = inject(CookieService);
  route = inject(Router);
  token = '';

  ngOnInit(): void {
    //console.debug(window.location.toString());
    if (window.location.toString() === this.baseUrl + '') {
      console.log('entro a la condicion de url base ');
    } else {
      this.token = this.cookieService.get(environment.nombreCookieToken);
      console.log(`entro a la condicion de validacion del token ${this.token}`);
      if (this.token === null || !this.token || this.token === undefined || this.token === '') {
        this.route.navigate(['']);
      } else {
        // this.usuarioService.consultarUsuarioValidado().subscribe( value => {
        //   if (value.isError === 'N') {
        //     const usuario = value.datos as Usuario;
        //     if (usuario === null || usuario.id === 0) {
        //       window.location.href = this.baseUrl + '#/login';
        //     }
        //   } else {
        //     window.location.href = this.baseUrl + '#/login';
        //   }
        // }, error => {
        //   window.location.href = this.baseUrl + '#/login';
        // });
      }
    }
  }

  ngOnDestroy() {
    this.cookieService.delete(environment.nombreCookieToken);
  }
}
