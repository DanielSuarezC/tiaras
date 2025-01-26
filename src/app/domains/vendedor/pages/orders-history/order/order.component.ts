import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../../shared/models/product/services/cart.service';
import { ProductService } from '../../../../shared/models/product/services/product.service';
import { BlockUIModule, NgBlockUI, BlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { CreatePedidoDto } from '../../../../shared/models/pedidos/dto/CreatePedidoDto';
import { CreateItemDto } from '../../../../shared/models/pedidos/dto/CreateItemDto';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BlockUIModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

    @BlockUI() blockUI?: NgBlockUI;
  // products = signal<Product[]>([]);
    private fb = inject(FormBuilder);
    private cartService = inject(CartService);
    private productService = inject(ProductService);

    createItemDto: CreateItemDto[] = [];

    cart = this.cartService.cart; //signal<Product[]>([]);
    total = this.cartService.total; //signal(0);
    subTotal = this.cartService.subTotal; //signal(0);
    shipment = this.cartService.getShipment();//10000

  public form1: FormGroup = this.fb.group({
    idCliente: ['', Validators.required],
    evento: ['', Validators.required],
    fechaPedido: ['', Validators.required],
    fechaEntrega: ['', Validators.required],
    valorTotal: ['', Validators.required],
    valorPagado: ['', Validators.required],
    estadoPago: ['', Validators.required],
    estadoPedido: ['', Validators.required]
  });

  ngOnInit(){
    this.form1.get('fechaPedido')?.setValue(new Date());
    this.form1.get('valorTotal')?.setValue(this.total());
    this.cart()
  }

  onSubmit(){
    //  this.blockUI?.start();
    //     if (this.form1.invalid) {
    //       // Marcar todos los campos como tocados para mostrar los errores
    //       this.form1.markAllAsTouched();
    //       Swal.fire('Formulario invalido', 'Formulario inválido', 'error');
    //       this.blockUI?.stop();
    //       return;
    //     }else{
    //       Swal.fire('Registro exitoso', 'Pedido guardado', 'success');
    //       // idCliente?: number;
    //     //     evento?: string;
    //     //     fechaPedido?: Date;
    //     //     fechaEntrega?: Date;
    //     //     valorTotal?: number;
    //     //     valorPagado?: number;
    //     //     estadoPago?: 'Pendiente' | '50% Pagado' |'100% Pagado' ;
    //     //     estadoPedido?: 'Pendiente' | 'En Proceso' | 'Terminado' |  'Incidencia';
    //     //     items?: CreateItemDto[];
      
    //     const createPedidoDto = new CreatePedidoDto();
        
    //     createItemDto.idProducto = this.cart().id;
    //     createPedidoDto.idCliente = this.form1.get('idCliente')?.value;
    //     createPedidoDto.evento = this.form1.get('evento')?.value;
    //     createPedidoDto.fechaPedido = this.form1.get('fechaPedido')?.value;
    //     createPedidoDto.fechaEntrega = this.form1.get('fechaEntrega')?.value;
    //     createPedidoDto.valorTotal = this.form1.get('valorTotal')?.value;
    //     createPedidoDto.valorPagado = this.form1.get('valorPagado')?.value;
    //     createPedidoDto.estadoPago = this.form1.get('estadoPago')?.value;
    //     createPedidoDto.estadoPedido = this.form1.get('estadoPedido')?.value;
    //     createPedidoDto.items = 
        
    //     this.authService.login(newUserLoginDto).subscribe( value => {
    //       console.log(value);
    //       if (value != null) {
    //         //leyendo el token decodificado
    //         this.paylod = jwtDecode(value.access_token);
    //         console.log(this.paylod.rol);
          
    //           const fecha = new Date();
    //           fecha.setMinutes(fecha.getMinutes() + environment.duracionMinutosCookieToken);
    //           this.cookieService.set(environment.nombreCookieToken,value.access_token, fecha);
    //           this.blockUI?.stop();
    //           switch (this.paylod.rol) {
    //             case 'ADMINISTRADOR':
    //               this.form1.reset();
    //               this.route.navigate(['/administrador/inventories']);
    //               break;
    //               case 'VENDEDOR':
    //               this.form1.reset();
    //               this.route.navigate(['/vendedor/catalog']);
    //               break;
    //           }
            
    //       } else {
    //         this.dialog.open(MensajeComponent, {data: {titulo: 'Error',
    //           mensaje: 'Error de validación. ' + value, textoBoton: 'Aceptar' }});
    //       }
    //       this.blockUI?.stop();
    //     }, error => {
    //       this.blockUI?.stop();
    //       this.dialog.open(MensajeComponent, {data: {titulo: 'Error',
    //         mensaje: 'Error de validación. ' + error.message, textoBoton: 'Aceptar' }});
    
    //       // this.dialog.open(MensajeComponent, {data: {titulo: 'Error', mensaje: error.message, textoBoton: 'Aceptar' }});
    //     });
        }

        
  
}
