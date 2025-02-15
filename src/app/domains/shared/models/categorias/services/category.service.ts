import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Categoria } from '../entities/Categoria';
import { CreateCategoriaDto } from '../dto/CreateCategoriaDto';
import { UpdateCategoriaDto } from '../dto/UpdateCategoriaDto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);
  baseUrl = environment.urlServices + 'categorias';

  constructor() { }

  public findAll(token: string | undefined): Observable<Categoria[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
      return this.http.get<Categoria[]>(this.baseUrl, {headers});
    }
  
    public findOne(idCategoria: number, token: string | undefined): Observable<Categoria> {
      let params = new HttpParams();
      if (idCategoria != null) {
      params = params.set('id', idCategoria + '');
      }
      const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
      });
      return this.http.get<Categoria>(this.baseUrl, { params, headers });
    }
  
    public create(createCategoriaDto: CreateCategoriaDto, token: string | undefined): Observable<any> {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
      });
      return this.http.post(this.baseUrl, createCategoriaDto, {headers});
    }
  
    public update(idCategoria: number, updateCategoriaDto: UpdateCategoriaDto, token: string | undefined): Observable<any> {
      const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
      });
      return this.http.patch(this.baseUrl + '/' + idCategoria, updateCategoriaDto, { headers });
    }

    public findByNombre(nombre: string, token: string | undefined):Observable<any[]>{
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
        });
        return this.http.get<any[]>(this.baseUrl + '/by-name/' + nombre, { headers });
    }
}
