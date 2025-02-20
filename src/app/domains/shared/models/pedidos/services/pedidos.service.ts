import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { pedido } from '../entities/pedido';
import { Observable } from 'rxjs';
import { CreatePedidoDto } from '../dto/CreatePedidoDto';
import { UpdatePedidoDto } from '../dto/UpdatePedidoDto';
import { Pedido } from '../entities/Pedido.interface';
import { Pagination } from '../../paginated.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  baseUrl = environment.urlServices + 'pedidos';
  http = inject(HttpClient);

  constructor() { }

  public findAll(token: string | undefined): Observable<pedido[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.get<pedido[]>(this.baseUrl, { headers });
  }

  public findOne(idPedido: number, token: string | undefined): Observable<Pedido> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    let params = new HttpParams();
    if (idPedido != null) {
      params = params.set('id', idPedido + '');
    }
    return this.http.get<Pedido>(this.baseUrl + '/' + idPedido, { headers });
  }

  public createPedido(createPedidoDto: CreatePedidoDto, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.post(this.baseUrl, createPedidoDto, {headers});
  }

  public updatePedido(idPedido: number, updatePedidoDto: UpdatePedidoDto, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.patch(this.baseUrl + '/' + idPedido, updatePedidoDto, { headers });
  }

  public findAllPaginate(token: string, page: number, search?: string, sortBy?: string): Observable<Pagination<Pedido>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    
    let url: string = `${this.baseUrl}/paginate?page=${page}`;
    if (search) url += `&filter.evento=${search}`;
    if (sortBy && sortBy.trim() !== '') url += `&sortBy=${sortBy}`;
    
    return this.http.get<Pagination<Pedido>>(url, { headers });
  }
}
