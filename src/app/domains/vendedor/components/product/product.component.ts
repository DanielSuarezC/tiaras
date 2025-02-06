import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output, output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../shared/models/product/services/cart.service';
import Swal from 'sweetalert2';
import { Producto } from '../../../shared/models/product/entities/Producto';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  baseUrl = environment.urlServices + 'uploads/';

  @Input({required: true}) product!: Producto;

  @Output() addToCart = new EventEmitter();

  private cartService = inject(CartService);

  cart = this.cartService.cart; //signal<Product[]>([]);

  productExists = false;

  addToCardHandler(){
    if(this.cartService.productExists(this.product.idProducto)){
      Swal.fire('Info', 'El producto ya se encuentra en el carrito.', 'warning');
    }else{
      this.cartService.addTocart(this.product);
    }
  }

}
