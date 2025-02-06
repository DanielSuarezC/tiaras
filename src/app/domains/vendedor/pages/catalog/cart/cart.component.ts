import { Component, inject, signal, SimpleChanges, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../shared/models/Product';
import { CartService } from '../../../../shared/models/product/services/cart.service';
import { ProductService } from '../../../../shared/models/product/services/product.service';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../../../app.component';
import generatePDF from '../../../../shared/components/pdf';
import Swal from 'sweetalert2';
import { Producto } from '../../../../shared/models/product/entities/Producto';
import { OverlayModule } from '@angular/cdk/overlay';
import { MensajeService } from '../../../../shared/mensaje/mensaje.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, OverlayModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent{

    products = signal<Product[]>([]);
    private cartService = inject(CartService);
    private productService = inject(ProductService);
    private mensaje = inject(MensajeService);

    cart = this.cartService.cart; //signal<Product[]>([]);
    total = this.cartService.total; //signal(0);
    subTotal = this.cartService.subTotal; //signal(0);
    shipment = this.cartService.getShipment();//10000
    createItemDto = this.cartService.createItemDto;

    isOpenModal = false;
   
    ngOnInit(){
      
    }
    
    ngOnChanges(changes: SimpleChanges){
      this.getProducts(); 
    }
  
    addToCart(product: Producto){
    //  this.cart.update(prevState => [...prevState, product]);
    this.cartService.addTocart(product);
    }
  
    private getProducts(){
      // console.log(`category_id: ${category_id}`);
      this.productService.getProducts()
      .subscribe({
        next: (products) => {
          this.products.set(products);
          // console.log(products);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
    removeItemProduct(productId: number | undefined) {
      return this.cartService.removeItem(productId);
    }

    cantidadEspecifica(idProducto: number | undefined){
      return this.cartService.cantidadEspecifica(idProducto);
    }

    incrementQuantity(idProducto: number | undefined){
      return this.cartService.incrementQuantity(idProducto);
    }

    decrementQuantity(idProducto: number | undefined){
      const cantidad = this.cantidadEspecifica(idProducto);
      if(cantidad && cantidad > 1){
        return this.cartService.decrementQuantity(idProducto);
      }else{
        Swal.fire('Warning','La cantidad mínima es 1','warning');
      }
    }

    clientValidate(){
      if(this.cart().length === 0){
        this.mensaje.showMessage('Información','No hay productos para proceder al pedido','warning');
        return;
      }
      this.mensaje.showClientValidate();
    }
    
    onGeneratePDF(){
      const fecha = '2021-09-01';
      // generatePDF(cart(),fecha);
    }
  }
