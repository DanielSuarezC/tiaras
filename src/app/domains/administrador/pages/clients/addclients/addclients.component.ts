import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../../../shared/models/clientes/services/clientes.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../environments/environment';
import { MensajeService } from '../../../../shared/mensaje/mensaje.service';
import { CreateClienteDto } from '../../../../shared/models/clientes/dto/CreateClienteDto';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { paylod } from '../../../../shared/models/paylod';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addclients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BtnComponent],
  templateUrl: './addclients.component.html',
  styleUrl: './addclients.component.css'
})
export class AddclientsComponent {
  private clientesServices = inject(ClientesService);
  private cookieService = inject(CookieService);
  private fb = inject(FormBuilder);
  public form1 = this.fb.group({
    cedula: ['', [Validators.required,Validators.minLength(7),Validators.maxLength(10)]],
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', Validators.email],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    pais: ['', Validators.required],
    ciudad: ['', Validators.required],
  });

    token?: string;
    paylod?: paylod
    route = inject(Router);
    private mensaje = inject(MensajeService);
  
    ngOnInit() {
      this.token = this.cookieService.get(environment.nombreCookieToken);
    }
  
    onSubmit() {
      if (this.form1.invalid) {
        this.form1.markAllAsTouched();
        this.mensaje.showMessage('Formulario invalido', 'Formulario inválido', 'error');
        // this.blockUI?.stop();
        return;
      }
      const createClienteDto = new CreateClienteDto();
      createClienteDto.cedula = this.form1.get('cedula')?.value ?? undefined;
      createClienteDto.nombre = this.form1.get('nombre')?.value ?? undefined;
      createClienteDto.apellidos = this.form1.get('apellidos')?.value ?? undefined;
      createClienteDto.email = this.form1.get('email')?.value ?? undefined;
      createClienteDto.telefono = this.form1.get('telefono')?.value ?? undefined;
      createClienteDto.direccion = this.form1.get('direccion')?.value ?? undefined;
      createClienteDto.pais = this.form1.get('pais')?.value ?? undefined;
      createClienteDto.ciudad = this.form1.get('ciudad')?.value ?? undefined;
      this.clientesServices.create(createClienteDto, this.token)
        .subscribe({
          next: (data) => {
            this.mensaje.showMessage('Cliente creado', 'Cliente creado con éxito', 'success');
            this.form1.reset();
            // this.blockUI?.stop();
          },
          error: (error) => {
            console.log(error.error.message);
            this.mensaje.showMessage('Error', `Error:  ${error.error.message}`, 'error');
          }
        });
      
    }

    volver(){
      if(this.token){
        this.paylod = jwtDecode(this.token);
      }
      if(this.paylod?.rol === 'ADMINISTRADOR'){
        this.route.navigate(['/administrador/clients']);
      }else if(this.paylod?.rol === 'VENDEDOR'){
        this.route.navigate(['/vendedor/cart']);
      }
    }
}
