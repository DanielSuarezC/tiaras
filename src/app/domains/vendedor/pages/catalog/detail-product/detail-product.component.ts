import { Component, inject, Input, signal } from '@angular/core';
import { Product } from '../../../../shared/models/Product';
import { ProductService } from '../../../../shared/models/product/services/product.service';
import { CartService } from '../../../../shared/models/product/services/cart.service';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import Swal from 'sweetalert2';
import { Producto } from '../../../../shared/models/product/entities/Producto';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, BtnComponent],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class DetailProductComponent {
  @Input() id?: string;
  product = signal<Producto | null>(null);
  cover = signal('');
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cookieService = inject(CookieService);
  cart = this.cartService.cart; //signal<Product[]>([]);

  token?: string; 

  ngOnInit() {
  this.token = this.cookieService.get(environment.nombreCookieToken);

  }

  getProduct(){
    if (this.id) {
      this.productService.findOne(this.token, this.id)
        .subscribe({
          next: (product) => {
            // console.log(product);
            this.product.set(product);
            if (product.imagenes && product.imagenes.length > 0) {
              this.cover.set(product.imagenes[0]);
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
    if (this.cartService.productExists(product?.idProducto)) {
      Swal.fire('Product already in cart', 'El producto ya se encuentra en el carrito', 'warning');
    } else if (product) {
        this.cartService.addTocart(product);
      }
    }
  

}
