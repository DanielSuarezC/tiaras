import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CreatePagoDto } from '../dto/CreatePagoDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

baseUrl = environment.urlServices + 'pagos';
http = inject(HttpClient);

constructor() { }

    public create(createPagoDto: CreatePagoDto, token: string | undefined): Observable<any> {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
      });
      return this.http.post(this.baseUrl, createPagoDto, {headers});
    }
}
