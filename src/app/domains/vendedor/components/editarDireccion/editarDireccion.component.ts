import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../../shared/models/clientes/services/clientes.service';
import { CookieService } from 'ngx-cookie-service';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';
import { environment } from '../../../../../environments/environment';
import { UpdateClienteDto } from '../../../shared/models/clientes/dto/UpdateClienteDto';

@Component({
  selector: 'app-editarDireccion',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './editarDireccion.component.html',

})
export class EditarDireccionComponent {

  dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  data = inject(DIALOG_DATA);
  clienteService = inject(ClientesService);
  private cookieService = inject(CookieService);
  // private fb = inject(FormBuilder);
  // public form1 = this.fb.group({
  //   direccion: ['', Validators.required],
  // });
  form1 = new FormGroup({
    direccion: new FormControl('direccion', Validators.required),
  });

  token?: string;
  private mensaje = inject(MensajeService);

  ngOnInit() {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.form1.get('direccion')?.setValue(this.data.direccion);
  }

  onSubmit() {
    if (this.form1.invalid) {
      this.form1.markAllAsTouched();
      this.mensaje.showMessage('Formulario inválido', 'Debe agregar una dirección', 'error');
      // this.blockUI?.stop();
      return;
    }else if(this.form1.get('direccion')?.value === this.data.direccion){
      this.mensaje.showMessage('Formulario inválido', 'Debe agregar una dirección diferente', 'error');
    }else{
      const updateClienteDto = new UpdateClienteDto();
      updateClienteDto.direccion = this.form1.get('direccion')?.value;
      updateClienteDto.cedula = this.data.cedula;
      updateClienteDto.nombre = this.data.nombre;
      updateClienteDto.apellidos = this.data.apellidos;
      updateClienteDto.email = this.data.email;
      updateClienteDto.telefono = this.data.telefono;
      updateClienteDto.pais = this.data.pais;
      updateClienteDto.ciudad = this.data.ciudad;
      this.clienteService.update(this.data.idCliente, updateClienteDto, this.token)
        .subscribe({
          next: (data) => {
            this.mensaje.toastMessage('Dirección actualizada', 'success', 'bottom-end', 3000);
            this.dialogRef.close('recargarPedido');
          },
          error: (error) => {
            this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
          }
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
    this.form1.reset();
  }

}
