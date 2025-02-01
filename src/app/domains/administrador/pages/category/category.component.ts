import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { CategoryService } from '../../../shared/models/categorias/services/category.service';
import { Category } from '../../../shared/models/category';
import { Dialog } from '@angular/cdk/dialog';
import { MensajeComponent } from '../../../shared/components/mensaje/mensaje.component'; 
import { Categoria } from '../../../shared/models/categorias/entities/Categoria';
import { environment } from '../../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { DialogModule } from '@angular/cdk/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, OverlayModule, RouterModule, CdkTableModule, DialogModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {

  categoryService = inject(CategoryService);
  dialog = inject(Dialog);
  private cookieService = inject(CookieService);
  categories = signal<Categoria[]>([]);

  isOpenActions = false;
  isOpenFilters = false;
  openDropdownIndex: number | null = null;

  private token?: string;

    ngOnInit(): void {
      this.getCategories();
    }
    
    private getCategories(){
      // this.blockUICategories?.start('Loading...')
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.categoryService.findAll(this.token)
    .subscribe({
      next: (data: Categoria[]) => {
        this.categories.set(data);
        // this.blockUICategories?.stop();
       
      },
      error: (error) => {
        // this.blockUICategories?.stop();
        // this.dialog.open(MensajeComponent, {data: {titulo: 'Error',
        //           mensaje: 'Error de obtención de datos. ' + error.message, textoBoton: 'Aceptar' }});
        Swal.fire('Error', `Error de obtención de datos.  ${error.message}`, 'error');
      }
    });
  }

    editCategory(category: any): void {
      console.log('Editar categoría:', category);
      // Aquí podrías redirigir a un formulario de edición
    }
    
    deleteCategory(id: number): void {
      if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        console.log('Eliminar categoría con ID:', id);
        // Llamada al servicio para eliminar la categoría
      }
    }    
  // Método para cerrar el dropdown
  closeDropdown(): void {
    this.openDropdownIndex = null;
  }
  
  closeFilter() {
    this.isOpenFilters = false;
  }

  // Método para alternar el estado del menú
  toggleDropdown(index: number): void {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }
}
