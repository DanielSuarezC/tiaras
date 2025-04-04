import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../shared/models/product/services/cart.service';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import {ScrollingModule} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, OverlayModule, RouterLinkActive, ScrollingModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isOpenCart = false;
  isOpenMenuMovil = false;
  isOpenAccount = false;

  route = inject(Router);

  private cartService = inject(CartService);
  cart = this.cartService.cart; //signal<Product[]>([]);
  subTotal = this.cartService.subTotal; //computed();
  total = this.cartService.total; //computed(0);

  cantidadEspecifica(idProducto: number | undefined) {
    return this.cartService.cantidadEspecifica(idProducto);
  }

  removeItemProduct(productId: number | undefined) {
    return this.cartService.removeItem(productId);
  }

  navigateToCarritoDetalle(): void{
    this.isOpenCart = false;
    this.route.navigate(['/vendedor/cart']);
  }

  clearCart(): void{
    this.cartService.clearCart();
  }

  openMenus(overlay: string){
    if(overlay === 'account') {
      this.isOpenAccount = !this.isOpenAccount; 
      this.isOpenMenuMovil = false; 
      this.isOpenCart = false;
    }
    if(overlay === 'cart'){
      this.isOpenCart = !this.isOpenCart; 
      this.isOpenMenuMovil = false; 
      this.isOpenAccount = false;
    } 
    if(overlay === 'menuMovil'){
      this.isOpenMenuMovil = !this.isOpenMenuMovil; 
      this.isOpenAccount = false; 
      this.isOpenCart = false;
    } 
  }

  cerrarMenus(){
    if(this.isOpenCart || this.isOpenMenuMovil || this.isOpenAccount){
      this.isOpenCart = false;
      this.isOpenMenuMovil = false;
      this.isOpenAccount = false;
    }
  }


}
