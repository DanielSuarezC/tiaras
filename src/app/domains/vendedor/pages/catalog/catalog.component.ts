import { Component, inject, Input, OnInit, signal, SimpleChange, SimpleChanges } from '@angular/core';
import { ProductComponent } from '../../components/product/product.component'; 
import { Product } from '../../../shared/models/Product';
import { CartService } from '../../../shared/services/cart/cart.service';
import { ProductService } from '../../../shared/services/product/product.service'; 
import { CategoryService } from '../../../shared/services/category/category.service';
import { Category } from '../../../shared/models/category';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ProductComponent, RouterLink],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit{
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categorieService = inject(CategoryService);

  @Input() category_id?: string;
  
  ngOnInit(){
    this.getCategories();

  }

  public method(){
    return console.log(this.products());
  }

  ngOnChanges(changes: SimpleChanges){
    this.getProducts(); 
    console.log(this.products());
  }

  addToCart(product: Product){
  //  this.cart.update(prevState => [...prevState, product]);
  this.cartService.addTocart(product);
  }

  private getProducts(category_id?: string){
    // console.log(`category_id: ${category_id}`);
    this.productService.getProducts(this.category_id)
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

  private getCategories(){
    this.categorieService.getAll()
    .subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
