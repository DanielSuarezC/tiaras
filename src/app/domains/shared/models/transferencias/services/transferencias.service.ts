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
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });

    let url: string = `${this.baseUrl}/insumos/${idInventario}?page=${page}`;

    return this.http.get<Pagination<TransferenciaInsumos>>(url, { headers });
  }
}
