import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from './paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  baseUrl = 'https://restcountries.com/v3.1/all';
  http = inject(HttpClient);
  getAll(): Observable<Country[]>{
    return this.http.get<Country[]>(this.baseUrl);
  }

  constructor() { }
}
