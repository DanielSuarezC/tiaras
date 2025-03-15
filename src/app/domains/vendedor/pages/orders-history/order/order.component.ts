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
import { Pagination } from '../../../../shared/models/paginated.interface';
import { Datepicker, DatepickerOptions, InstanceOptions } from 'flowbite';

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
  fechaPedido?: string;
  createPedidoDto = new CreatePedidoDto();

  /* Datepicker */
  private datepicker: Datepicker;

  public form1: FormGroup = this.fb.group({
    cedula: ['', Validators.required],
    evento: ['', Validators.required],
    direccion: ['', Validators.required],
    fechaPedido: ['', Validators.required],
    fechaEntrega: [''],
    valorTotal: ['', Validators.required],
  });

  ngOnInit() {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.getClientes();
    this.fechaPedido = new Date().toISOString().split('T')[0];
    this.form1.get('fechaPedido')?.setValue(this.fechaPedido);
    console.log('Date',this.fechaPedido);
    this.form1.get('fechaPedido')?.disable();
    this.form1.get('valorTotal')?.setValue(this.total());
    this.cart()

    this.form1.get('cedula').valueChanges.subscribe(value => {
      this.clienteService.findByCedula(value,this.token)
      .subscribe({
        next: (data) => {
          this.form1.get('direccion').setValue(data[0].direccion);
        },
        error: (error) => {
          this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.error.message}`, 'error');
        }
      });
    });
  }

  initializeDatePicker() {
    const datepickerEl: HTMLInputElement = document.getElementById('fechaEntrega') as HTMLInputElement;
    // optional options with default values and callback functions
    const options: DatepickerOptions = {
      format: 'yyyy-mm-dd',
      autohide: true,
      orientation: 'bottom',
    };

    // instance options object
    const instanceOptions: InstanceOptions = {
      id: 'fechaEntrega',
      override: true
    };

    if (datepickerEl) {
      const datepicker = new Datepicker(
        datepickerEl,
        options,
        instanceOptions
    );
    this.datepicker = datepicker;
    }
  }

  ngAfterViewInit() {
    this.initializeDatePicker();
  }

  onSubmit() {
    this.blockUI?.start();
    console.log(this.form1.value);
    if (this.form1.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      this.form1.markAllAsTouched();
      // Swal.fire('Formulario invalido', 'Formulario inválido', 'error');
      this.mensaje.showMessage('Formulario inválido','Formulario inválido' ,'error');
      this.blockUI?.stop();
      return;
    } else {
    
      const fechaEntrega: HTMLInputElement = document.getElementById('fechaEntrega') as HTMLInputElement;

      this.createPedidoDto.cedula = Number(this.form1.get('cedula')?.value);
      this.createPedidoDto.evento = this.form1.get('evento')?.value;
      this.createPedidoDto.fechaEntrega = new Date(fechaEntrega.value);
      this.createPedidoDto.valorTotal = this.form1.get('valorTotal')?.value;
      this.createPedidoDto.direccion = this.form1.get('direccion')?.value;
      console.log('signal',this.createItemDto());
      this.createPedidoDto.items = this.createItemDto();
      console.log('objeto',this.createPedidoDto.items); //se asocian los items al pedido
      if(fechaEntrega.value <= this.fechaPedido){
        this.mensaje.showMessage('Advertencia', 'La fecha de entrega no puede ser menor o igual a la fecha de pedido', 'warning');
        this.blockUI?.stop();
        return;
      }else if(this.cart().length === 0){
        this.mensaje.showMessage('Advertencia', 'El carrito no puede estar vacío', 'warning');
        this.blockUI?.stop();
        return;
      }else{
        this.createPedido(); 
      }
    }
  }

  private createPedido(){
    this.pedidoService.createPedido(this.createPedidoDto, this.token).subscribe({
      next: (value) => {
        console.log(value);
        // Swal.fire('Registro exitoso', 'Pedido guardado', 'success');
        this.mensaje.showMessage('Registro exitoso', 'Pedido guardado', 'success');
        this.form1.reset();
        this.clearCart();
        this.blockUI?.stop();
      },
      error: (error) => {
        console.error(error);
        this.mensaje.showMessage('Error', 'Error.' + error.error.message, 'error');
        this.blockUI?.stop();
      }
    });
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
      next: (data: Pagination<cliente>) => {
        this.clientes.set(data.data);
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
