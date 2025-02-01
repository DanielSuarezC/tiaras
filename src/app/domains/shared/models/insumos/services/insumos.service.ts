import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { CreateInsumoDto } from '../dto/CreateInsumoDto';
import { Observable } from 'rxjs';
import { Insumo } from '../entities/Insumo';
import { UpdateInsumoDto } from '../dto/UpdateInsumoDto';

@Injectable({
  providedIn: 'root'
})
export class InsumosService {

  private http = inject(HttpClient);
  baseUrl = environment.urlServices + 'insumos';

  constructor() { }

  public create(createInsumoDto: CreateInsumoDto, imagen: string | undefined, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const formData = new FormData();
    formData.append('insumo', JSON.stringify(createInsumoDto)); // Convertir DTO a JSON string
    if(imagen){
      formData.append('imagen', imagen); // Agregar la imagen
    }
    return this.http.post(this.baseUrl, formData, { headers });
  
  }

  public crear(formData: FormData, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(this.baseUrl, formData, { headers });
  
  }
  

  public findAll(token: string | undefined): Observable<Insumo[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.get<Insumo[]>(this.baseUrl, { headers });
  }

  public findOne(idInsumo: number, token: string | undefined): Observable<Insumo> {
    let params = new HttpParams();
    if (idInsumo != null) {
      params = params.set('id', idInsumo + '');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.get<Insumo>(this.baseUrl, { params, headers });
  }

  public update(idInsumo: number, updateInsumoDto: UpdateInsumoDto, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.patch(this.baseUrl + '/' + idInsumo, updateInsumoDto, { headers });
  }

  public delete(idInsumo: number,  token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.delete(this.baseUrl + '/' + idInsumo, { headers });
  }
}
