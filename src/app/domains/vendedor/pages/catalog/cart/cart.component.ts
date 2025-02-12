import { Component, inject, signal, SimpleChanges, Input, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../shared/models/product/services/cart.service';
import { ProductService } from '../../../../shared/models/product/services/product.service';
import { CommonModule } from '@angular/common';
import generatePDF from '../../../../shared/components/pdfMake';
import Swal from 'sweetalert2';
import { Producto } from '../../../../shared/models/product/entities/Producto';
import { OverlayModule } from '@angular/cdk/overlay';
import { MensajeService } from '../../../../shared/mensaje/mensaje.service';
import { environment } from '../../../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, OverlayModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private mensaje = inject(MensajeService);
  private platformId = inject(PLATFORM_ID);

  cart = this.cartService.cart; //signal<Product[]>([]);
  total = this.cartService.total; //signal(0);
  subTotal = this.cartService.subTotal; //signal(0);
  shipment = this.cartService.getShipment();//10000
  createItemDto = this.cartService.createItemDto;

  baseUrl = environment.urlServices + 'uploads/';

  isOpenModal = false;

  ngOnInit() {

  }


  addToCart(product: Producto) {
    this.cartService.addTocart(product);
  }


  removeItemProduct(productId: number | undefined) {
    return this.cartService.removeItem(productId);
  }

  cantidadEspecifica(idProducto: number | undefined) {
    return this.cartService.cantidadEspecifica(idProducto);
  }

  incrementQuantity(idProducto: number | undefined) {
    return this.cartService.incrementQuantity(idProducto);
  }

  decrementQuantity(idProducto: number | undefined) {
    const cantidad = this.cantidadEspecifica(idProducto);
    if (cantidad && cantidad > 1) {
      return this.cartService.decrementQuantity(idProducto);
    } else {
      Swal.fire('Warning', 'La cantidad mínima es 1', 'warning');
    }
  }

  clientValidate() {
    if (this.cart().length === 0) {
      this.mensaje.showMessage('Información', 'No hay productos para proceder al pedido', 'warning');
      return;
    }
    this.mensaje.showClientValidate();
  }

  onGeneratePDF() {
    if (isPlatformBrowser(this.platformId)) {
      import('pdfmake/build/pdfmake').then(pdfMakeModule => {
        import('pdfmake/build/vfs_fonts').then(pdfFontsModule => {
          const pdfMake = pdfMakeModule.default;
          pdfMake.vfs = pdfFontsModule.vfs;
          const fecha = new Date().toLocaleDateString();
          generatePDF(this.cart(), fecha, this.cartService);
        });
      });
    }
  }
}
