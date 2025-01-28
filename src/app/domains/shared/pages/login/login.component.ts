import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../models/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
// import { CryptoJS } from 'crypto-js';
import { UsuarioAuth } from '../../models/auth/entities/UsuarioAuth'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioLoginDto } from '../../models/auth/dto/UsuarioLoginDto';
import { jwtDecode } from 'jwt-decode';
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';
import { paylod } from '../../models/paylod';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { MensajeComponent } from '../../components/mensaje/mensaje.component';
import { BtnComponent } from '../../components/btn/btn.component';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BlockUIModule, DialogModule, BtnComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  // email = new FormControl('', [Validators.required, Validators.email]);
  // password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cookieService = inject(CookieService);
  route = inject(Router);
  dialog = inject(Dialog);
  public form1: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });


  mostrarFormulario?: boolean;
  email?: string;
  password?: string;
  usuarioAuth?: UsuarioAuth;
  paylod?: paylod;
  baseUrl = environment.urlAplicacion;

  @BlockUI() blockUI?: NgBlockUI;  


  constructor() { }

  ngOnInit(): void {
    this.cookieService.delete(environment.nombreCookieToken);
    this.form1.get('email')?.setValue('');
    this.form1.get('password')?.setValue('');

  }
  validar() {
    
    this.blockUI?.start();
    if (this.form1.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      this.form1.markAllAsTouched();
      Swal.fire('Formulario invalido', 'Formulario inválido', 'error');
      this.blockUI?.stop();
      return;
    }
  
    // Si el formulario es válido, continuar con la lógica
    this.email = this.form1.get('email')?.value;
    this.password = this.form1.get('password')?.value;
    switch (this.email) {
      case 'admin@correo':
        this.form1.reset();
        this.route.navigate(['/administrador/inventories']);
        break;
        case 'vendedor@correo':
        this.form1.reset();
        this.route.navigate(['/vendedor/catalog']);
        break;
    }
    const newUserLoginDto = new UsuarioLoginDto();
    newUserLoginDto.email = this.form1.get('email')?.value;
    newUserLoginDto.password = this.form1.get('password')?.value;
    this.authService.login(newUserLoginDto).subscribe( value => {
      console.log(value);
      if (value != null) {
        //leyendo el token decodificado
        this.paylod = jwtDecode(value.access_token);
        console.log(this.paylod.rol);
      
          const fecha = new Date();
          fecha.setMinutes(fecha.getMinutes() + environment.duracionMinutosCookieToken);
          this.cookieService.set(environment.nombreCookieToken,value.access_token, fecha);
          this.blockUI?.stop();
          switch (this.paylod.rol) {
            case 'ADMINISTRADOR':
              this.form1.reset();
              this.route.navigate(['/administrador/inventories']);
              break;
              case 'VENDEDOR':
              this.form1.reset();
              this.route.navigate(['/vendedor/catalog']);
              break;
          }
        
      } else {
        this.dialog.open(MensajeComponent, {data: {titulo: 'Error',
          mensaje: 'Error de validación. ' + value, textoBoton: 'Aceptar' }});
      }
      this.blockUI?.stop();
    }, error => {
      this.blockUI?.stop();
      this.dialog.open(MensajeComponent, {data: {titulo: 'Error',
        mensaje: 'Error de validación. ' + error.message, textoBoton: 'Aceptar' }});

      // this.dialog.open(MensajeComponent, {data: {titulo: 'Error', mensaje: error.message, textoBoton: 'Aceptar' }});
    });
  }

hasErrors(controlName: string, errorType: string) {
  return this.form1.get(controlName)?.hasError(errorType) && this.form1.get(controlName)?.touched;

}



}
