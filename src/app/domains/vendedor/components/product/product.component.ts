import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output, output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../shared/models/product/services/cart.service';
import Swal from 'sweetalert2';
import { Producto } from '../../../shared/models/product/entities/Producto';
import { environment } from '../../../../../environments/environment';
import { Categoria } from '../../../shared/models/categorias/entities/Categoria';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';

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
  private mensaje = inject(MensajeService);

  cart = this.cartService.cart; //signal<Product[]>([]);

  categorias: Categoria[] = [];

  ngOnInit(){
    this.product.categorias.forEach(categoria => {
      this.categorias.push(categoria);
    });
  }

  productExists = false;

  addToCardHandler(){
    if(this.cartService.productExists(this.product.idProducto)){
      this.mensaje.showMessage('Información','El producto ya se encuentra en el carrito.', 'warning');
    }else{
      this.cartService.addTocart(this.product);
      this.mensaje.toastMessage('Producto agregado al carrito.', 'success', 'bottom-end', 2000);
    }
  }

}
