import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../environments/environment';
import { MensajeService } from '../../../../shared/mensaje/mensaje.service';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ClientesService } from '../../../../shared/models/clientes/services/clientes.service';
import { cliente } from '../../../../shared/models/clientes/entities/cliente';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BlockUIModule, DialogModule, BtnComponent, InputComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

  @BlockUI() blockUI?: NgBlockUI;
  // products = signal<Product[]>([]);
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private pedidoService = inject(PedidosService);
  private clienteService = inject(ClientesService);
  private dialog = inject(Dialog);
  private cookieService = inject(CookieService);
  private mensaje = inject(MensajeService);

  cart = this.cartService.cart; //signal<Product[]>([]);
  total = this.cartService.total; //signal(0);
  subTotal = this.cartService.subTotal; //signal(0);
  shipment = this.cartService.getShipment();
  createItemDto = this.cartService.createItemDto;//signal<CreateItemDto[]>([]);
  clientes = signal<cliente[]>([]);
  cedula?: string;
  token?: string;

  public form1: FormGroup = this.fb.group({
    idCliente: ['', Validators.required],
    evento: ['', Validators.required],
    fechaPedido: ['', Validators.required],
    fechaEntrega: ['', Validators.required],
    valorTotal: ['', Validators.required],
    estadoPedido: ['', Validators.required]
  });

  ngOnInit() {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.getClientes();
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
      // Swal.fire('Formulario invalido', 'Formulario inválido', 'error');
      this.mensaje.showMessage('Formulario inválido','Formulario inválido' ,'error');
      this.blockUI?.stop();
      return;
    } else {
      const createPedidoDto = new CreatePedidoDto();
      
      createPedidoDto.idCliente = this.form1.get('idCliente')?.value;
      createPedidoDto.evento = this.form1.get('evento')?.value;
      createPedidoDto.fechaEntrega = this.form1.get('fechaEntrega')?.value;
      createPedidoDto.valorTotal = this.form1.get('valorTotal')?.value;
      createPedidoDto.estadoPedido = this.form1.get('estadoPedido')?.value;
      createPedidoDto.items = this.createItemDto();

      if(this.form1.get('fechaEntrega')?.value >= this.form1.get('fechaPedido')?.value){
        // Swal.fire('Error', 'La fecha de entrega no puede ser menor a la fecha de pedido', 'error');
        this.mensaje.showMessage('Error', 'La fecha de entrega no puede ser menor a la fecha de pedido', 'error');
        this.blockUI?.stop();
        return;
      }
      
      // this.pedidoService.createPedido(createPedidoDto, this.token).subscribe({
      //   next: (value) => {
      //     console.log(value);
      //     // Swal.fire('Registro exitoso', 'Pedido guardado', 'success');
      //     this.mensaje.showMessage('Registro exitoso', 'Pedido guardado', 'success');
      //     this.blockUI?.stop();
      //   },
      //   error: (error) => {
      //     console.error(error);
      //     this.dialog.open(MensajeComponent, {
      //       data: {
      //         titulo: 'Error',
      //         mensaje: 'Error. ' + error.message, textoBoton: 'Aceptar'
      //       }
      //     });
      //     this.blockUI?.stop();
      //   }
      // });
    }  
  }

  private getClientesByCedula(){
    // this.blockUICategories?.start('Loading...');
    this.clienteService.findByCedula(this.cedula,this.token)
    .subscribe({
      next: (data) => {
        this.clientes.set(data);
        // this.blockUICategories?.stop();
      },
      error: (error) => {
        // this.blockUICategories?.stop();
        this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
      }
    });
  }

  private getClientes(){
    this.clienteService.findAll(this.token)
    .subscribe({
      next: (data) => {
        this.clientes.set(data);
        // this.blockUICategories?.stop();
      },
      error: (error) => {
        // this.blockUICategories?.stop();
        this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
      }
    });
  }

  buscarCliente(dato: string){
    this.clientes.set([]);
    this.cedula = dato;
    this.getClientesByCedula();
    console.log(`dato: ${dato} `);
  }

  clearCart(){
    this.cartService.clearCart();
  }
}
