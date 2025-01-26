import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreatePedidoDto } from '../dto/CreatePedidoDto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = environment.urlServices + 'pedidos';
  http = inject(HttpClient);

  constructor() { }

  public crearPedido(createPedidoDto: CreatePedidoDto){
    return this.http.post(this.baseUrl, createPedidoDto);
  }
}
