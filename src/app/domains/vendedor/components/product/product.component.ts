import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output, output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Product } from '../../../shared/models/Product';
import { TimeAgoPipePipe } from '../../../shared/pipes/time-ago-pipe.pipe';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../shared/models/product/services/cart.service';
// import { BtnComponent } from '../../components/btn/btn.component';
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
    if(this.cartService.productExists(this.product.id)){
      Swal.fire('Product already in cart', 'El producto ya se encuentra en el carrito', 'warning');
    }else{
      this.cartService.addTocart(this.product);
    }
  }

}
