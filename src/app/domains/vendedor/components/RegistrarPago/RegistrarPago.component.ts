import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../../shared/models/clientes/services/clientes.service';
import { CookieService } from 'ngx-cookie-service';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';
import { environment } from '../../../../../environments/environment';
import { CreatePagoDto } from '../../../shared/models/pagos/dto/CreatePagoDto';
import { PagosService } from '../../../shared/models/pagos/services/Pagos.service';

@Component({
  selector: 'app-RegistrarPago',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './RegistrarPago.component.html',
})
export class RegistrarPagoComponent implements OnInit {

  
  dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  data = inject(DIALOG_DATA);
  pagoService = inject(PagosService);
  private cookieService = inject(CookieService);

  form1 = new FormGroup({
    valorPagado: new FormControl('valorPagado', Validators.required),
  });

  token?: string;
  private mensaje = inject(MensajeService);

  ngOnInit() {
    this.token = this.cookieService.get(environment.nombreCookieToken);
  }

  onSubmit() {
    if (this.form1.invalid) {
      this.form1.markAllAsTouched();
      this.mensaje.showMessage('Formulario inválido', 'Debe agregar una valor', 'error');
      // this.blockUI?.stop();
      return;
    }else if((this.form1.get('valorPagado')?.value + this.data.valorPagado ) > this.data.valorTotal){
      this.mensaje.showMessage('Advertencia', 'El valor pagado supera el valor total del pedido', 'warning');
    }else{
      const createPagoDto = new CreatePagoDto();
      createPagoDto.idPedido = this.data.idPedido;
      createPagoDto.valorPagado = Number(this.form1.get('valorPagado')?.value);
      this.pagoService.create(createPagoDto, this.token)
        .subscribe({
          next: (data) => {
            this.mensaje.toastMessage('Pago agregado', 'success', 'bottom-end', 3000);
            this.dialogRef.close('PagoAgregado');
          },
          error: (error) => {
            this.mensaje.showMessage('Error', `${error.error.message}`, 'error');
          }
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
    this.form1.reset();
  }


}
