  import { Component, inject, Input, signal } from '@angular/core';
  import { environment } from '../../../../../../environments/environment';
  import { PedidosService } from '../../../../shared/models/pedidos/services/pedidos.service';
  import { CookieService } from 'ngx-cookie-service';
  import { CommonModule } from '@angular/common';
  import { Pedido } from '../../../../shared/models/pedidos/entities/Pedido.interface';
  import { OverlayModule } from '@angular/cdk/overlay';
  import { Dialog } from '@angular/cdk/dialog';
  import { EditarDireccionComponent } from '../../../components/editarDireccion/editarDireccion.component';
  import { get } from 'http';
  import { RegistrarPagoComponent } from '../../../components/RegistrarPago/RegistrarPago.component';
  import { RouterLink } from '@angular/router';
  import { CartService } from '../../../../shared/models/product/services/cart.service';
  import { MensajeService } from '../../../../shared/mensaje/mensaje.service';
  import { UpdatePedidoDto } from '../../../../shared/models/pedidos/dto/UpdatePedidoDto';
import Swal from 'sweetalert2';

  @Component({
    selector: 'app-detail-order',
    standalone: true,
    imports: [CommonModule, OverlayModule, RouterLink],
    templateUrl: './detail-order.component.html',
    styleUrl: './detail-order.component.css'
  })
  export class DetailOrderComponent {
    @Input() id?: number;

    pedido = signal<Pedido | null>(null);
    // cliente = signal<cliente | null>(null);
    private pedidosService = inject(PedidosService);
    private cookieService = inject(CookieService);
    private dialog = inject(Dialog);
    private mensaje = inject(MensajeService);
    public shipment = inject(CartService).getShipment();

    token?: string;

    baseUrl = environment.urlServices + 'uploads/';

    ngOnInit() {
      this.token = this.cookieService.get(environment.nombreCookieToken);
      this.getPedido();
    }

    getPedido() {
      if (this.id) {
        this.pedidosService.findOne(this.id, this.token)
          .subscribe({
            next: (pedido: Pedido) => {
              this.pedido.set(pedido);
            }
          }
          );
      }
    }

    terminarPedido() {
      Swal.fire({
        title: '¿Está seguro de terminar el pedido?',
        text: 'Una vez terminado el pedido no se podrá modificar',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#C69D75",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, terminar pedido"
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Terminar pedido');
          
          let updatePedidoDto = new UpdatePedidoDto();
          // updatePedidoDto.idPedido = this.pedido()?.idPedido;
          updatePedidoDto.idCliente = this.pedido()?.cliente.idCliente;
          updatePedidoDto.evento = this.pedido()?.evento;
          updatePedidoDto.estadoPedido = 'Terminado';
          updatePedidoDto.estadoPago = this.pedido()?.estadoPago as 'Pendiente' | '50% Pagado' | '100% Pagado';
          updatePedidoDto.fechaPedido = new Date(this.pedido()?.fechaPedido);
          updatePedidoDto.fechaEntrega = new Date(this.pedido()?.fechaEntrega);
          updatePedidoDto.valorPagado = Number(this.pedido()?.valorPagado);
          updatePedidoDto.valorTotal = Number(this.pedido()?.valorTotal);
          updatePedidoDto.items = this.pedido()?.__items__;
    
          this.pedidosService.updatePedido(this.id, updatePedidoDto, this.token).subscribe({
            next: (data) => {
              this.mensaje.showMessage('Pedido terminado', 'El pedido ha sido terminado con éxito', 'success');
              this.getPedido();
            },
            error: (error) => {
              this.mensaje.showMessage('Error', 'Ha ocurrido un error al terminar el pedido', 'error');
            }
          });
        }
      });
    }
    

    openDialog(): void {
      const dialogRef = this.dialog.open<string>(EditarDireccionComponent, {
        width: '250px',
        data: this.pedido().cliente,
      });
      
      dialogRef.closed.subscribe(result => {
        /**Si el diálogo al cerrar retorna 'recargarPedido' se recarga el pedido, 
           de lo contrario no.
        **/
        if(result === 'recargarPedido'){
          this.getPedido();
        }
      });
    }

    openDialogPagos(): void {
      const dialogRef = this.dialog.open<string>(RegistrarPagoComponent, {
        width: '250px',
        data: this.pedido(),
      });
      
      dialogRef.closed.subscribe(result => {
        /**Si el diálogo al cerrar retorna 'pagoAgreado' se agrega un pago, 
           de lo contrario no.
        **/
        if(result === 'pagoAgregado'){
          this.getPedido();
        }
      });
    }
  }
