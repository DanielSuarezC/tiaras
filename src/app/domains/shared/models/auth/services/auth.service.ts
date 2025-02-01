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

  public mensaje(title: string, text:string, icon:string){
    switch(icon){
      case 'success':
        Swal.fire({
          title: title,
          text: `${text}`,
          icon: 'success', 
          confirmButtonColor: "#C69D75", 
          confirmButtonText: "Aceptar" });
        break;
      case 'error':
        Swal.fire({
          title: title,
          text: `${text}`,
          icon: 'error', 
          confirmButtonColor: "#C69D75", 
          confirmButtonText: "Aceptar" });
        break;
      case 'warning':
        Swal.fire({
          title: title,
          text: `${text}`,
          icon: 'warning', 
          confirmButtonColor: "#C69D75", 
          confirmButtonText: "Aceptar" });
        break;
      case 'info':
        Swal.fire({
          title: title,
          text: `${text}`,
          icon: 'info', 
          confirmButtonColor: "#C69D75", 
          confirmButtonText: "Aceptar" });
        break;
      case 'question':
        Swal.fire({
          title: title,
          text: `${text}`,
          icon: 'question', 
          confirmButtonColor: "#C69D75", 
          confirmButtonText: "Aceptar" });
        break
    }
    
  }
}
