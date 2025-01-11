import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
// import * as CryptoJS from 'crypto-js';
import { UsuarioAuth } from '../../models/UsuarioAuth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  // email = new FormControl('', [Validators.required, Validators.email]);
  // password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  
  private fb = inject(FormBuilder);
  public form1: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  private authService = inject(AuthService);
  private cookieService = inject(CookieService);
  route = inject(Router);
  mostrarFormulario?: boolean;
  email?: string;
  password?: string;
  usuarioAuth?: UsuarioAuth;
  baseUrl = environment.urlAplicacion;

  // @BlockUI() blockUI : NgBlockUI;  


  constructor() { }

  ngOnInit(): void {
    this.cookieService.delete(environment.nombreCookieToken);
    // this.form1 = this.fb.group({
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required]]
    // });
    this.form1.get('email')?.setValue('');
    this.form1.get('password')?.setValue('');
  }

  validar() {
    // this.blockUI.start();
    if (this.form1.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      this.form1.markAllAsTouched();
      Swal.fire('Formulario invalido', 'Formulario inválido', 'error');
      return;
    }
  
    // Si el formulario es válido, continuar con la lógica
    this.email = this.form1.get('email')?.value;
    this.password = this.form1.get('password')?.value;
    console.log(this.form1);
  
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
//     this.authService.login(this.email,CryptoJS.MD5(this.password).toString(CryptoJS.enc.Hex)).subscribe( value => {
//       console.log(value);
//       if (value != null) {
//         this.usuarioAuth = value as UsuarioAuth;
//         // this.usuarioStateService.setUsuario(this.usuario);
      
//           const fecha = new Date();
//           fecha.setMinutes(fecha.getMinutes() + environment.duracionMinutosCookieToken);
//           // this.cookieService.set(environment.nombreCookieToken, this.usuarioAuth.token, fecha);
//           // this.blockUI.stop();
//           window.location.href = environment.urlAplicacion + '#/inicio';
        
//       } else {
//        // this.blockUI.stop();

//       }
//       // this.blockUI.stop();
//     }, error => {
//       // this.blockUI.stop();
//       console.log(error);
//       // this.dialog.open(MensajeComponent, {data: {titulo: 'Error', mensaje: error.message, textoBoton: 'Aceptar' }});
//     });
  }

hasErrors(controlName: string, errorType: string) {
  return this.form1.get(controlName)?.hasError(errorType) && this.form1.get(controlName)?.touched;

}

}
