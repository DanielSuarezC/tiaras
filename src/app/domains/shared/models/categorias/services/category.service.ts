import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Categoria } from '../entities/Categoria';
import { CreateCategoriaDto } from '../dto/CreateCategoriaDto';
import { UpdateCategoriaDto } from '../dto/UpdateCategoriaDto';
import { Pagination } from '../../paginated.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);
  baseUrl = environment.urlServices + 'categorias';

  constructor() { }

  public findAll(token: string, page: number, search?: string, sortBy?: string): Observable<Pagination<Categoria>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });

    let url = `${this.baseUrl}?page=${page}`;
    if (search && search.length > 0) url += `&filter.nombre=$ilike:${search}`;
    if (sortBy && sortBy.length > 0) url += `&sortBy=${sortBy}`;

    return this.http.get<Pagination<Categoria>>(url, { headers });
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
    return this.http.post(this.baseUrl, createCategoriaDto, { headers });
  }

  public update(idCategoria: number, updateCategoriaDto: UpdateCategoriaDto, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.patch(this.baseUrl + '/' + idCategoria, updateCategoriaDto, { headers });
  }

  public findByNombre(nombre: string, token: string | undefined): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.get<any[]>(this.baseUrl + '/by-name/' + nombre, { headers });
  }
}
