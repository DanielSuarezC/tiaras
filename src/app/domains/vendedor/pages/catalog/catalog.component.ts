import { Component, inject, Input, OnInit, signal, effect } from '@angular/core';
import { ProductComponent } from '../../components/product/product.component'; 
import { CartService } from '../../../shared/models/product/services/cart.service';
import { ProductService } from '../../../shared/models/product/services/product.service'; 
import { CategoryService } from '../../../shared/models/categorias/services/category.service'; 
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgBlockUI, BlockUIModule, BlockUI } from 'ng-block-ui';
import { OverlayModule } from '@angular/cdk/overlay';
import { Producto } from '../../../shared/models/product/entities/Producto';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../environments/environment';
import { Categoria } from '../../../shared/models/categorias/entities/Categoria';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';
import { InputComponent } from '../../../shared/components/input/input.component';


@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ProductComponent, RouterModule, BlockUIModule, OverlayModule, InputComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit{
  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categoriaService = inject(CategoryService);
  private cookieService = inject(CookieService);
  private mensaje = inject(MensajeService);

  initialized = false;

  nombreCategoria = '';
  size = signal<number>(0);
  categoriasAgregadas = signal<Categoria[]>([]);
  selectCategory: string = '';
  isOpenFilter = false;
  isFilter = false;
  private token?: string;

  @Input() category_id?: string;
  @BlockUI('categories-block') blockUICategories?: NgBlockUI;
  @BlockUI('products-block') blockUIProducts?: NgBlockUI;
  
  ngOnInit(){
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.getProducts();
    this.initialized = true;
  }

  constructor(){
    effect(() => {
      if (this.initialized && this.categoriasAgregadas().length === 0) {
        this.isFilter = false;
        this.getProducts();
      }
    });

  }
  
  addToCart(product: Producto){
    this.cartService.addTocart(product);
  }
  
  private getProducts(category_id?: string){
    this.blockUIProducts?.start('Loading...');
    this.productService.findAll(this.token)
    .subscribe({
      next: (data: any[]) => {
        this.productos.set(data[0]);
        this.blockUIProducts?.stop();
        this.selectCategory = 'Todos los productos';
        // console.log(products);
      },
      error: (error) => {
        this.blockUIProducts?.stop();
        this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.message}`, 'error');
      }
    });
    
  }

  filtrarProductos(){
    let categoriasId: number[] = this.categoriasAgregadas().map(categoria => categoria.idCategoria);
    this.blockUIProducts?.start('Loading...');
    this.productService.findProductosByCategorias(categoriasId, this.token)
    .subscribe({
      next: (data: any[]) => {
        this.productos.set(data);
        this.selectCategory = this.categoriasAgregadas().length === 1 ? `${this.categoriasAgregadas().length} categoría seleccionada` : `${this.categoriasAgregadas().length} categorías seleccionadas`;
        this.isFilter = true;
        this.blockUIProducts?.stop();

        if(this.productos().length === 0){
          this.mensaje.toastMessage('No se encontraron productos con las categorías seleccionadas', 'info', 'bottom-end', 4000);
        }else{
          this.mensaje.toastMessage(this.productos().length === 1 ? `${this.productos().length} producto ha sido encontrado` : `${this.productos().length} productos han sido encontrados`, 'info', 'bottom-end', 4000);
        }
      },
      error: (error) => {
        this.blockUIProducts?.stop();
        this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
      }
    });
  }

  private getCategoriesByName(){
    this.categoriaService.findByNombre(this.nombreCategoria,this.token)
    .subscribe({
      next: (data: Categoria[]) => {
        this.categorias.set(data);
      },
      error: (error) => {
        this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
      }
    });
  }

  buscarCategoria(dato: string) {
    if (dato.trim().length > 0) {
      this.categorias.set([]);
      this.nombreCategoria = dato;
      this.getCategoriesByName();
      this.size.set(this.categorias().length);
      
      if (this.categorias().length > 0 && this.categorias().length <= 5) {
        const selectElement = document.getElementById('categoria') as HTMLSelectElement;
      
        if (selectElement) {
          selectElement.size = this.categorias().length;
        }
      }
    } else {
      this.categorias.set([]);
    }
  }

    // Modificar método agregarCategoria
    agregarCategoria(categoria: Categoria) {
      this.categoriasAgregadas.update(cats => [...cats, categoria]);
      // console.log(this.categoriasAgregadas());
    }
  
    /* Verificar si una categoria existe en el arreglo de Categorias */
    existCategoria(categoria: Categoria): boolean {
      return this.categoriasAgregadas().includes(categoria);
    }

    quitarCategoria(categoria: Categoria) {
      this.categoriasAgregadas.update(cats => cats.filter(cat => cat !== categoria));
    }

    removerFiltros(){
      this.categoriasAgregadas.set([]);
    }


}
