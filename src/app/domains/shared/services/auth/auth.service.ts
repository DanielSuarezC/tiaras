import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UsuarioLoginDto } from '../../dto/UsuarioLoginDto';
import { tokenjwt } from '../../models/tokenjwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  baseUrl = environment.urlServices + 'tiaras/api/auth/login';
  http = inject(HttpClient);
  constructor() { 
  }

  public login(usuarioLoginDto: UsuarioLoginDto): Observable<tokenjwt> {
    return this.http.post<tokenjwt>(this.baseUrl, usuarioLoginDto);
  }
}
