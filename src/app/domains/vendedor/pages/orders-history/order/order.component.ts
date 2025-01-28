import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../../shared/models/product/services/cart.service';
import { ProductService } from '../../../../shared/models/product/services/product.service';
import { BlockUIModule, NgBlockUI, BlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { CreatePedidoDto } from '../../../../shared/models/pedidos/dto/CreatePedidoDto';
import { CreateItemDto } from '../../../../shared/models/pedidos/dto/CreateItemDto';
import { PedidosService } from '../../../../shared/models/pedidos/services/pedidos.service';
import { MensajeComponent } from '../../../../shared/components/mensaje/mensaje.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { create } from 'domain';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BlockUIModule, DialogModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

  @BlockUI() blockUI?: NgBlockUI;
  // products = signal<Product[]>([]);
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private pedidoService = inject(PedidosService);
  private dialog = inject(Dialog);
  private cookieService = inject(CookieService);

  cart = this.cartService.cart; //signal<Product[]>([]);
  total = this.cartService.total; //signal(0);
  subTotal = this.cartService.subTotal; //signal(0);
  shipment = this.cartService.getShipment();
  createItemDto = this.cartService.createItemDto;//signal<CreateItemDto[]>([]);

  public form1: FormGroup = this.fb.group({
    idCliente: ['', Validators.required],
    evento: ['', Validators.required],
    fechaPedido: ['', Validators.required],
    fechaEntrega: ['', Validators.required],
    valorTotal: ['', Validators.required],
    estadoPedido: ['', Validators.required]
  });

  ngOnInit() {
    this.form1.get('fechaPedido')?.setValue(new Date().toISOString().substring(0, 10));
    this.form1.get('fechaPedido')?.disable();
    this.form1.get('valorTotal')?.setValue(this.total());
    this.cart()
  }

  onSubmit() {
    this.blockUI?.start();
    if (this.form1.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      this.form1.markAllAsTouched();
      Swal.fire('Formulario invalido', 'Formulario inválido', 'error');
      this.blockUI?.stop();
      return;
    } else {
      const createPedidoDto = new CreatePedidoDto();
      const token = this.cookieService.get(environment.nombreCookieToken);
      createPedidoDto.idCliente = this.form1.get('idCliente')?.value;
      createPedidoDto.evento = this.form1.get('evento')?.value;
      createPedidoDto.fechaEntrega = this.form1.get('fechaEntrega')?.value;
      createPedidoDto.valorTotal = this.form1.get('valorTotal')?.value;
      createPedidoDto.estadoPedido = this.form1.get('estadoPedido')?.value;
      createPedidoDto.items = this.createItemDto();
      
      this.pedidoService.createPedido(createPedidoDto, token).subscribe({
        next: (value) => {
          console.log(value);
          Swal.fire('Registro exitoso', 'Pedido guardado', 'success');
          this.blockUI?.stop();
        },
        error: (error) => {
          console.error(error);
          this.dialog.open(MensajeComponent, {
            data: {
              titulo: 'Error',
              mensaje: 'Error. ' + error.message, textoBoton: 'Aceptar'
            }
          });
          this.blockUI?.stop();
        }
      });
    }


  }
}
