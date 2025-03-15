import { Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { paylod } from '../../models/paylod';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

  private router = inject(Router);
  private token;
  private cookieService = inject(CookieService);
  private paylod?: paylod;

  ngOnInit(){
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.paylod = jwtDecode(this.token);
  }

  navigateToHome(){
    if(this.paylod.rol === 'ADMINISTRADOR'){
      this.router.navigate(['/administrador/inventarios']);
    }else if(this.paylod.rol === 'VENDEDOR'){
      this.router.navigate(['/vendedor/catalog']);
    }else{
      this.router.navigate(['/']);
    }
  }
    

}
