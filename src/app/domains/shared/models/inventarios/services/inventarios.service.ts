import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Inventario } from '../entities/inventario.entity';
import { CreateInventarioDto } from '../dto/create-inventario.dto';
import { UpdateResult } from '../../update-result';
import { InsumoStock } from '../dto/insumo-stock.dto';
import { ProductoStock } from '../dto/producto-stock.dto';
import { Pagination } from '../../paginated.interface';

@Injectable({
  providedIn: 'root'
})
export class InventariosService {
  private baseUrl: string = `${environment.urlServices}inventarios`;

  constructor(
    private http: HttpClient
  ) { }

  /* Obtener todos los Inventarios */
  findAll(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });

    return this.http.get<Inventario[]>(this.baseUrl, { headers });
  }

  findAllPaginate(page: number, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });

    return this.http.get<Pagination<Inventario>>(`${this.baseUrl}/paginate?page=${page}`, { headers });
  }

  /* Obtener la Información de un Inventario por Id */
  findById(idInventario: number, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });

    return this.http.get<Inventario>(`${this.baseUrl}/${idInventario}`, { headers });
  }

  /* Crear un Inventario */
  create(createInventarioDto: CreateInventarioDto, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });

    return this.http.post<Inventario>(this.baseUrl, createInventarioDto, { headers });
  }

  /* Actualizar un Inventario */
  update(idInventario: number, createInventarioDto: CreateInventarioDto, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });

    return this.http.patch<UpdateResult>(`${this.baseUrl}/${idInventario}`, createInventarioDto, { headers });
  }

  /* Consultar Stock de Insumos */
  findInsumoStock(idInventario: number, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });

    return this.http.get<InsumoStock[]>(`${this.baseUrl}/${idInventario}/stock/insumos`, { headers });
  }

  /* Consultar Stock de Insumos con Filtros y Paginación */
  findInsumoStockPaginate(idInventario: number, token: string, page: number, search?: string, sortBy?: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    let url: string = `${this.baseUrl}/${idInventario}/stock/insumos?page=${page}`;
    if (search) url += `&filter.insumo.nombre=$ilike:${search}`;
    if (sortBy && sortBy.trim() !== '') url += `&sortBy=${sortBy}`;

    return this.http.get<Pagination<InsumoStock>>(url, { headers });
  }

  /* Consultar Stock de Productos */
  findProductoStock(idInventario: number, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });

    return this.http.get<ProductoStock[]>(`${this.baseUrl}/${idInventario}/stock/productos`, { headers });
  }
}
