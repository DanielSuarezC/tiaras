import { Component, inject, Input, OnInit, signal, SimpleChange, SimpleChanges } from '@angular/core';
import { ProductComponent } from '../../components/product/product.component'; 
import { Product } from '../../../shared/models/Product';
import { CartService } from '../../../shared/models/product/services/cart.service';
import { ProductService } from '../../../shared/models/product/services/product.service'; 
import { CategoryService } from '../../../shared/models/categorias/services/category.service'; 
import { Category } from '../../../shared/models/category';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgBlockUI, BlockUIModule, BlockUI } from 'ng-block-ui';
import { Dialog } from '@angular/cdk/dialog';
import { MensajeComponent } from '../../../shared/components/mensaje/mensaje.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ProductComponent, RouterLink, BlockUIModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit{
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categorieService = inject(CategoryService);
  private dialog = inject(Dialog);

  @Input() category_id?: string;
  @BlockUI('categories-block') blockUICategories?: NgBlockUI;
  @BlockUI('products-block') blockUIProducts?: NgBlockUI;
  
  ngOnInit(){  
    this.getCategories();
    console.log(this.categories());
  }
  
  ngOnChanges(changes: SimpleChanges){
    this.getProducts(); 
  }

  addToCart(product: Product){
  //  this.cart.update(prevState => [...prevState, product]);
  this.cartService.addTocart(product);
  }

  private getProducts(category_id?: string){
    // console.log(`category_id: ${category_id}`);
    this.blockUIProducts?.start('Loading...');
    this.productService.getProducts(this.category_id)
    .subscribe({
      next: (products) => {
        this.products.set(products);
        this.blockUIProducts?.stop();
        // console.log(products);
      },
      error: (error) => {
        this.blockUIProducts?.stop();
         this.dialog.open(MensajeComponent, {data: {titulo: 'Error',
                  mensaje: 'Error de obtención de datos. ' + error.message, textoBoton: 'Aceptar' }});
      }
    });
    
  }

  private getCategories(){
    // this.blockUICategories?.start('Loading...');
    this.categorieService.getAll()
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
