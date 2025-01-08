import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../shared/services/cart/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  hideSideMenu = signal(true);

  private cartService = inject(CartService);
  cart = this.cartService.cart; //signal<Product[]>([]);
  total = this.cartService.total; //signal(0);

  toogleSideMenu(){
    this.hideSideMenu.update(prevState => !prevState);  
  }

}
