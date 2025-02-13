import { Component, inject, Input, OnInit, signal, SimpleChange, SimpleChanges } from '@angular/core';
import { ProductComponent } from '../../components/product/product.component'; 
import { Product } from '../../../shared/models/Product';
import { CartService } from '../../../shared/models/product/services/cart.service';
import { ProductService } from '../../../shared/models/product/services/product.service'; 
import { CategoryService } from '../../../shared/models/categorias/services/category.service'; 
import { Category } from '../../../shared/models/category';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgBlockUI, BlockUIModule, BlockUI } from 'ng-block-ui';
import { Dialog } from '@angular/cdk/dialog';
import { MensajeComponent } from '../../../shared/components/mensaje/mensaje.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { Producto } from '../../../shared/models/product/entities/Producto';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../environments/environment';
import { Categoria } from '../../../shared/models/categorias/entities/Categoria';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ProductComponent, RouterModule, BlockUIModule, OverlayModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit{
  productos = signal<Producto[]>([]);
  categories = signal<Categoria[]>([]);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categorieService = inject(CategoryService);
  private cookieService = inject(CookieService);
  private mensaje = inject(MensajeService);
  private dialog = inject(Dialog);

  selectCategory: string = 'All';
  isOpenFilter = false;
  token?: string;

  @Input() category_id?: string;
  @BlockUI('categories-block') blockUICategories?: NgBlockUI;
  @BlockUI('products-block') blockUIProducts?: NgBlockUI;
  
  ngOnInit(){
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.getCategories();
    this.getProducts();
  }
  
  // ngOnChanges(changes: SimpleChanges){
  //   this.getProducts(); 
  // }
  
  addToCart(product: Producto){
    //  this.cart.update(prevState => [...prevState, product]);
    this.cartService.addTocart(product);
  }
  
  private getProducts(category_id?: string){
    // console.log(`category_id: ${category_id}`);
    this.blockUIProducts?.start('Loading...');
    this.productService.findAll(this.token)
    .subscribe({
      next: (data: any[]) => {
        this.productos.set(data[0]);
        this.blockUIProducts?.stop();
        // console.log(products);
      },
      error: (error) => {
        this.blockUIProducts?.stop();
        //  this.dialog.open(MensajeComponent, {data: {titulo: 'Error',
        //           mensaje: 'Error de obtención de datos. ' + error.message, textoBoton: 'Aceptar' }});
        this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.message}`, 'error');
      }
    });
    
  }

  private getCategories(){
    // this.blockUICategories?.start('Loading...');
    this.categorieService.findAll(this.token)
    .subscribe({
      next: (data) => {
        this.categories.set(data);
        // this.blockUICategories?.stop();
      },
      error: (error) => {
        // this.blockUICategories?.stop();
        this.dialog.open(MensajeComponent, {data: {titulo: 'Error',
                  mensaje: 'Error de obtención de datos. ' + error.message, textoBoton: 'Aceptar' }});
      }
    });
  }
}
