import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { CreateClienteDto } from '../dto/CreateClienteDto';
import { Observable } from 'rxjs';
import { cliente } from '../entities/cliente';
import { UpdateClienteDto } from '../dto/UpdateClienteDto';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private http = inject(HttpClient);
  baseUrl = environment.urlServices + 'clientes';

  constructor() { }

  public create(createClienteDto: CreateClienteDto, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(this.baseUrl, createClienteDto, { headers });    
  }

  public findAll(token: string | undefined): Observable<cliente[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.get<cliente[]>(this.baseUrl, { headers });
  }

  public findOne(idCliente: number, token: string | undefined): Observable<cliente> {
    let params = new HttpParams();
    if (idCliente != null) {
      params = params.set('id', idCliente + '');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.get<cliente>(this.baseUrl, { params, headers });
  }

  public update(idCliente: number, updateClienteDto: UpdateClienteDto, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.put(this.baseUrl + '/' + idCliente, updateClienteDto, { headers });
  }
}
