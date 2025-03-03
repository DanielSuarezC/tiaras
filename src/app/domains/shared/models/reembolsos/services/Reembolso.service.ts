import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reembolso } from '../entities/Reembolso';
import { CreateReembolsoDto } from '../dto/CreateReembolso';
import { Pagination } from '../../paginated.interface';
import { UpdateReembolsoDto } from '../dto/UpdateReembolso';

@Injectable({
  providedIn: 'root'
})
export class ReembolsoService {

  baseUrl = environment.urlServices + 'reembolsos';
  http = inject(HttpClient);

  constructor() { }
  
  public create(createReembolsoDto: CreateReembolsoDto, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.post(this.baseUrl, createReembolsoDto, {headers});
  }

  public findAll(token: string | undefined): Observable<Reembolso[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.get<Reembolso[]>(this.baseUrl, { headers });
  }

  public findAllPaginate(token: string, page: number, search?: string, sortBy?: string): Observable<Pagination<Reembolso>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    
    let url: string = `${this.baseUrl}?page=${page}`;
    if (search) url += `&filter.evento=${search}`;
    if (sortBy && sortBy.trim() !== '') url += `&sortBy=${sortBy}`;
    
    return this.http.get<Pagination<Reembolso>>(url, { headers });
  }

  public findOne(idReembolso: number, token: string | undefined): Observable<Reembolso> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.get<Reembolso>(this.baseUrl + '/' + idReembolso, { headers });
  }


  public update(idReembolso: number, updateReembolsoDto: UpdateReembolsoDto, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.patch(this.baseUrl + '/' + idReembolso, updateReembolsoDto, { headers });
  }

  
  public updateValorReembolso(idReembolso: number, valorReembolso: number, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json' // Asegurar que se envía como JSON
    });
    return this.http.patch(`${this.baseUrl}/${idReembolso}/valorReembolso`, {valorReembolso: valorReembolso}, { headers });
  }
  public updateEstado(idReembolso: number, estado: string, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json' // Asegurar que se envía como JSON
    });
    return this.http.patch(`${this.baseUrl}/${idReembolso}/estado`, {estado: estado}, { headers });
  }

}
