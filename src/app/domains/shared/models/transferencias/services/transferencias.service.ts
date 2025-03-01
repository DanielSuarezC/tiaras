import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TransferenciaInsumos } from '../entities/transferencia-insumos.entity';
import { Pagination } from '../../paginated.interface';

@Injectable({
  providedIn: 'root'
})
export class TransferenciasService {
  private baseUrl: string = `${environment.urlServices}transferencias`;
  
  constructor(
    private http: HttpClient
  ) { }

  /* Obtener todas las Transferencias de Insumos */
  findAllTI(token: string, idInventario: number, page: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let url: string = `${this.baseUrl}/insumos/${idInventario}?page=${page}`;
    return this.http.get<Pagination<TransferenciaInsumos>>(url, { headers });
  }

  /* Obtener una Transferencia de Insumos */
  findOneTI(token: string, idTransferencia: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let url: string = `${this.baseUrl}/${idTransferencia}`;
    console.log(url);
    return this.http.get<TransferenciaInsumos>(url, { headers });
  }
}
