import { Component, inject, Input, signal } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { PedidosService } from '../../../../shared/models/pedidos/services/pedidos.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../../../shared/models/pedidos/entities/Pedido.interface';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.css'
})
export class DetailOrderComponent {
  @Input() id?: number;

  pedido = signal<Pedido | null>(null);
  // cliente = signal<cliente | null>(null);
  private pedidosService = inject(PedidosService);
  private cookieService = inject(CookieService);

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
}
