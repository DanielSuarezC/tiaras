import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { CreateProductoDto } from '../dto/CreateProductoDto';
import { Observable } from 'rxjs';
import { Producto } from '../entities/Producto';
import { InsumoProducto } from '../entities/InsumoProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  baseUrl = environment.urlServices + 'productos';
  insumosAgregados = signal<InsumoProducto[]>([]);
  constructor() { }


  public create(createProductoDto: CreateProductoDto, imagen: File, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const formData = new FormData();
    formData.append('producto', JSON.stringify(createProductoDto)); // Convertir DTO a JSON string
    // if (imagen) {
    formData.append('files', imagen); // Agregar la imagen
    // }
    return this.http.post(this.baseUrl, formData, { headers });

  }

  crearProducto(producto: any, imagenes: File[], token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const formData = new FormData();

    // Convertir producto a JSON string
    formData.append('producto', JSON.stringify(producto));

    // Agregar cada imagen
    imagenes.forEach((imagen, index) => {
      formData.append('files', imagen, imagen.name);
    });

    return this.http.post(this.baseUrl, formData, { headers });
  }

  // En product.service.ts
  createProducto(
    producto: CreateProductoDto,
    archivos: File[],
    token: string
  ): Promise<void> {
    const formData = new FormData();
    formData.append('producto', JSON.stringify(producto));

    archivos.forEach((archivo, index) => {
      formData.append(`files`, archivo);
    });

    return this.http.post<void>(`${this.baseUrl}/productos`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).toPromise();
  }

  public crear(formData: FormData, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(this.baseUrl, formData, { headers });

  }


  public findAll(token: string | undefined): Observable<Producto[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.get<Producto[]>(this.baseUrl, { headers });
  }

  public findOne(idProducto: string | undefined, token: string | undefined): Observable<Producto> {
    let params = new HttpParams();
    if (idProducto != null) {
      params = params.set('idProducto', idProducto + '');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
    return this.http.get<Producto>(this.baseUrl + '/' + idProducto, { headers });
  }

  // public findProductosByCategorias(categoriasId: number[], token: string | undefined):Observable<any[]>{
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
  //     });
  //     return this.http.post<any[]>(this.baseUrl + '/filtrar/' + categoriasId, { headers });
  // }
  public findProductosByCategorias(categoriasId: number[], token: string | undefined): Observable<Producto[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post<Producto[]>(`${this.baseUrl}/filtrar`, { categorias: categoriasId }, { headers });
  }
  
}
