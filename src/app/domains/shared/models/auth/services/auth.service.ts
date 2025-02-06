import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UsuarioLoginDto } from '../dto/UsuarioLoginDto';
import { tokenjwt } from '../../tokenjwt';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  baseUrl = environment.urlServices + 'auth/login';
  http = inject(HttpClient);
  constructor() { 
  }

  public login(usuarioLoginDto: UsuarioLoginDto): Observable<tokenjwt> {
    return this.http.post<tokenjwt>(this.baseUrl, usuarioLoginDto);
  }
}
