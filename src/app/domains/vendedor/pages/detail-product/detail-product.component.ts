import { Component, inject, Input, signal } from '@angular/core';
import { ProductService } from '../../../shared/models/product/services/product.service';
import { CartService } from '../../../shared/models/product/services/cart.service';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import Swal from 'sweetalert2';
import { Producto } from '../../../shared/models/product/entities/Producto';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../environments/environment';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';


@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, BtnComponent],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class DetailProductComponent {
  @Input() id?: string;
  product: Producto = new Producto();
  categorias: any[] = [];
  cover = signal('');
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cookieService = inject(CookieService);
  private mensaje = inject(MensajeService);
  cart = this.cartService.cart; //signal<Product[]>([]);

  token?: string;

  baseUrl = environment.urlServices + 'uploads/';

  ngOnInit() {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.getProduct();
  }

  getProduct() {
    if (this.id) {
      this.productService.findOne(this.id, this.token)
        .subscribe({
          next: (product: Producto) => {
            this.product = product;
            this.categorias = product.categorias;
            if (product.imagenes && product.imagenes.length > 0) {
              this.cover.set(this.baseUrl + product.imagenes[0]);
            }
          }
        }
        );
    }
  }

  changeCover(image: string) {
    image = this.baseUrl + image;
    this.cover.set(image);
  }

  addToCart() {
    if (this.cartService.productExists(this.product?.idProducto)) {
      this.mensaje.showMessage('Información', 'El producto ya se encuentra en el carrito.', 'warning');
    } else if (this.product) {
      this.cartService.addTocart(this.product);
      this.mensaje.toastMessage('Producto agregado al carrito.', 'success', 'bottom-end', 2000);
    }
  }


}
