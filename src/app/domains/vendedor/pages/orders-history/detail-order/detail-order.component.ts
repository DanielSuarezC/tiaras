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

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [CommonModule, OverlayModule],
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
      /**Si el diálogo al cerrar retorna 'recargarPedido' se recarga el pedido, 
         de lo contrario no.
      **/
      if(result === 'pagoAgregado'){
        this.getPedido();
      }
    });
  }
}
