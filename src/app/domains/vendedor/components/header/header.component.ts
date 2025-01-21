import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../shared/services/cart/cart.service';
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


  removeItemProduct(productId: number | undefined) {
    return this.cartService.removeItem(productId);
  }

  navigateToCarritoDetalle(): void{
    this.isOpenCart = false;
    this.route.navigate(['/vendedor/cart']);
  }


}
