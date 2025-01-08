import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  baseUrl = environment.urlServices;
  http = inject(HttpClient);
  constructor() { 
  }

  public login(email: string, password: string) {
    return this.http.post(this.baseUrl + 'login', {email, password});
  }
}
