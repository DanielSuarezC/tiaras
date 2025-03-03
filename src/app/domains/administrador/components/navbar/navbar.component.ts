import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {OverlayModule} from '@angular/cdk/overlay';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive,OverlayModule],
  templateUrl: './navbar.component.html',
  
})
export class NavbarComponent {
  isOpenAccount = false;
  isOpenMenuMovil = false;
  isOpeninventario = false;

  openMenus(overlay: string){
    if(overlay === 'account') {
      this.isOpenAccount = !this.isOpenAccount; 
      this.isOpenMenuMovil = false; 
      this.isOpeninventario = false;
    }
    if(overlay === 'menuMovil'){
      this.isOpenMenuMovil = !this.isOpenMenuMovil; 
      this.isOpenAccount = false; 
      this.isOpeninventario = false;
    } 
    if(overlay === 'inventario'){
      this.isOpeninventario = !this.isOpeninventario; 
      this.isOpenAccount = false; 
      this.isOpenMenuMovil = false;
    } 
  }

  cerrarMenus(){
    if(this.isOpeninventario || this.isOpenMenuMovil || this.isOpenAccount){
      this.isOpeninventario = false;
      this.isOpenMenuMovil = false;
      this.isOpenAccount = false;
    }
  }
}
