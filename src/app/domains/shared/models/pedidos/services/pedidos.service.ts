import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { pedido } from '../entities/pedido';
import { Observable } from 'rxjs';
import { CreatePedidoDto } from '../dto/CreatePedidoDto';
import { UpdatePedidoDto } from '../dto/UpdatePedidoDto';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  baseUrl = environment.urlServices + 'pedidos';
  http = inject(HttpClient);

  constructor() { }

  public findAll(): Observable<pedido[]> {
    return this.http.get<pedido[]>(this.baseUrl);
  }

  public findOne(idPedido: number): Observable<pedido> {
    let params = new HttpParams();
    if (idPedido != null) {
      params = params.set('id', idPedido + '');
    }
    return this.http.get<pedido>(this.baseUrl, { params });
  }

  public createPedido(createPedidoDto: CreatePedidoDto, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.post(this.baseUrl, createPedidoDto, {headers});
  }

  public updatePedido(idPedido: number, updatePedidoDto: UpdatePedidoDto): Observable<any> {
    return this.http.put(this.baseUrl + '/' + idPedido, updatePedidoDto);
  }
}
