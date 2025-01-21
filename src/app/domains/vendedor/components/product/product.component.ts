import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output, output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Product } from '../../../shared/models/Product';
import { TimeAgoPipePipe } from '../../../shared/pipes/time-ago-pipe.pipe';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../shared/services/cart/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, TimeAgoPipePipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  @Input({required: true}) product!: Product;

  @Output() addToCart = new EventEmitter();

  private cartService = inject(CartService);

  cart = this.cartService.cart; //signal<Product[]>([]);

  productExists = false;

  addToCardHandler(){
    console.log('Add to cart');
    this.productExists = this.cart().some(cartItem => cartItem.id === this.product.id);
    if (this.productExists) {
      Swal.fire('Product already in cart', 'El producto ya se encuentra en el carrito', 'warning');
    }else{
      this.addToCart.emit(this.product);
    }
  }

}
