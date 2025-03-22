import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePedidoDto } from '../dto/CreatePedidoDto';
import { UpdatePedidoDto } from '../dto/UpdatePedidoDto';
import { Pedido } from '../entities/Pedido.interface';
import { Pagination } from '../../paginated.interface';
import { SearchArray } from '../../SearchArray.interface';
import { APIResponse } from '../../response';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  baseUrl = environment.urlServices + 'pedidos';
  http = inject(HttpClient);

  constructor() { }

  public findAll(token: string | undefined): Observable<APIResponse<Pedido[]>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.get<APIResponse<Pedido[]>>(this.baseUrl, { headers });
  }

  public findOne(idPedido: number, token: string | undefined): Observable<APIResponse<Pedido>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });

    let params = new HttpParams();
    if (idPedido != null) params = params.set('id', idPedido + '');

    return this.http.get<APIResponse<Pedido>>(this.baseUrl + '/find-one/' + idPedido, { headers });
  }

  public createPedido(createPedidoDto: CreatePedidoDto, token: string | undefined): Observable<APIResponse<Pedido>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });

    return this.http.post<APIResponse<Pedido>>(this.baseUrl, createPedidoDto, {headers});
  }

  public updatePedido(idPedido: number, updatePedidoDto: UpdatePedidoDto, token: string | undefined): Observable<APIResponse<Pedido>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.patch<APIResponse<Pedido>>(this.baseUrl + '/' + idPedido, updatePedidoDto, { headers });
  }

  public updateEstadoPedido(idPedido: number, estadoPedido: string, token: string | undefined): Observable<APIResponse<Pedido>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json' // Asegurar que se envía como JSON
    });
  
    return this.http.patch<APIResponse<Pedido>>(`${this.baseUrl}/${idPedido}/estado`, {estadoPedido}, { headers });
  }

  public updateDireccionPedido(idPedido: number, direccion: string, token: string | undefined): Observable<APIResponse<Pedido>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json' // Asegurar que se envía como JSON
    });
  
    return this.http.patch<APIResponse<Pedido>>(`${this.baseUrl}/${idPedido}`, {direccion: direccion}, { headers });
  }
  

  public findAllPaginate(token: string, page: number, search?: string, sortBy?: string): Observable<APIResponse<Pagination<Pedido>>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    
    let url: string = `${this.baseUrl}/paginate?page=${page}`;
    if (search) url += `&filter.cliente.cedula=${search}`;
    if (sortBy && sortBy.trim() !== '') url += `&sortBy=${sortBy}`;
    
    return this.http.get<APIResponse<Pagination<Pedido>>>(url, { headers });
  }

  public filter(token: string, page: number, terminos?: SearchArray[], sortBy?: string): Observable<APIResponse<Pagination<Pedido>>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    
    let url: string = `${this.baseUrl}/paginate?page=${page}`;
    for(let termino of terminos){
      if (termino.term==='estadoPedido'){
        for(let search of termino.search){
          /*
            Si el arreglo search tiene un solo elemento, se agrega el filtro de estadoPedido con el operador $eq
            Si el arreglo search tiene más de un elemento, se considera un filtro combinado y se usa el operador $or 
           */
          url += (search.length == 1) ? `&filter.estadoPedido=$eq:${search}`: `&filter.estadoPedido=$or:${search}`;
        }
      }
      if (termino.term==='estadoPago'){
        for(let search of termino.search){
          /*
            Si el arreglo search tiene un solo elemento, se agrega el filtro de estadoPago con el operador $eq
            Si el arreglo search tiene más de un elemento, se considera un filtro combinado y se usa el operador $or 
           */
          url += (termino.search.length == 1) ? `&filter.estadoPago=$eq:${search}`: `&filter.estadoPago=$or:${search}`;
        }
      }
      if (termino.term==='fechaPedido') url += `&filter.fechaPedido=${termino.search}`;
      if (termino.term==='fechaEntrega') url += `&filter.fechaEntrega=${termino.search}`;
      if (termino.term==='cliente') url += `&filter.cliente.cedula=${termino.search}`;
      if (termino.term==='evento') url += `&filter.evento=${termino.search}`;
    }
    // if (search && term==='EstadoPedido') url += `&filter.cliente.cedula=${search}`;
    if (sortBy && sortBy.trim() !== '') url += `&sortBy=${sortBy}`;
    return this.http.get<APIResponse<Pagination<Pedido>>>(url, { headers });
  }
}
