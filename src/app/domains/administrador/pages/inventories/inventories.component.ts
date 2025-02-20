import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/models/product/services/product.service';
import { Producto } from '../../../shared/models/product/entities/Producto';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [CommonModule, OverlayModule, RouterModule],
  templateUrl: './inventories.component.html',
  styleUrl: './inventories.component.css'
})
export class InventoriesComponent {
  // Inyectar servicios
  productoService = inject(ProductService);
  mensaje = inject(MensajeService);
  cookieService = inject(CookieService);
  productos = signal<Producto[]>([]);

  openDropdownIndex: number | null = null;
  isOpenFilters = false;
  isOpenDropdown = false;

  token: string | undefined;

  ngOnInit(){
    this.getProductos();
  }

  // Método para cerrar el dropdown
  closeDropdown() {
    this.isOpenDropdown = false;
  }
  closeFilter() {
    this.isOpenFilters = false;
  }
  editProducto(producto: any): void {
    console.log('Editar producto:', producto);
    // Aquí podrías redirigir a un formulario de edición
  }

  deleteProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      console.log('Eliminar producto con ID:', id);
      // Llamada al servicio para eliminar la categoría
    }
  }
  
  // Método para alternar el estado del menú
  toggleDropdown(index: number): void {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }
  
  private getProductos(){
    // this.blockUICategories?.start('Loading...');
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.productoService.findAll(this.token)
    .subscribe({
      next: (data: any[]) => {
        //el array data tiene dos elementos el primero en la posición 0 es el array de productos y en la posicion 1 está vacío
        this.productos.set(data[0]);
        // this.blockUICategories?.stop();
      },
      error: (error) => {
        // this.blockUICategories?.stop();
        this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
      }
    });
  }


}
