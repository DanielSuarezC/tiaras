import { Component, inject, Input, signal } from '@angular/core';
import { Product } from '../../../../shared/models/Product';
import { ProductService } from '../../../../shared/models/product/services/product.service';
import { CartService } from '../../../../shared/models/product/services/cart.service';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, BtnComponent],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class DetailProductComponent {
  @Input() id?: string;
  product = signal<Product | null>(null);
  cover = signal('');
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  cart = this.cartService.cart; //signal<Product[]>([]);
  ngOnInit() {

    if (this.id) {
      this.productService.getOne(this.id)
        .subscribe({
          next: (product) => {
            // console.log(product);
            this.product.set(product);
            if (product.images && product.images.length > 0) {
              this.cover.set(product.images[0]);
            }
          }
        }
        );
    }
  }

  changeCover(image: string) {
    this.cover.set(image);
  }

  addToCart() {
    const product = this.product();
    if (this.cartService.productExists(product?.id)) {
      Swal.fire('Product already in cart', 'El producto ya se encuentra en el carrito', 'warning');
    } else if (product) {
        this.cartService.addTocart(product);
      }
    }
  

}
