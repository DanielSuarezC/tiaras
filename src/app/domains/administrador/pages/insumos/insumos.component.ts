import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';
import { InsumosService } from '../../../shared/models/insumos/services/insumos.service';
import { Dialog } from '@angular/cdk/dialog';
import { CookieService } from 'ngx-cookie-service';
import { Insumo } from '../../../shared/models/insumos/entities/Insumo';
import { environment } from '../../../../../environments/environment';
import { MensajeComponent } from '../../../shared/components/mensaje/mensaje.component'; 
import { DialogModule } from '@angular/cdk/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [CommonModule, OverlayModule, RouterModule, DialogModule],
  templateUrl: './insumos.component.html',
  styleUrl: './insumos.component.css'
})
export class InsumosComponent {

  insumoService = inject(InsumosService);
  dialog = inject(Dialog);
  private cookieService = inject(CookieService);
  Insumos = signal<Insumo[]>([]);

  isOpenActions = false;
  isOpenFilters = false;
  openDropdownIndex: number | null = null;

  private token?: string;

  ngOnInit(): void {
    this.getInsumos();
  }

  private getInsumos() {
    // this.blockUICategories?.start('Loading...')
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.insumoService.findAll(this.token)
      .subscribe({
        next: (data: Insumo[]) => {
          this.Insumos.set(data);
          // this.blockUICategories?.stop();
        },
        error: (error) => {
          // this.blockUICategories?.stop();
          
          // this.dialog.open(MensajeComponent, {
          //   data: {
          //     titulo: 'Error',
          //     mensaje: 'Error de obtención de datos. ' + error.message, textoBoton: 'Aceptar'
          //   }
          // });
          Swal.fire('Error', `Error de obtención de datos.  ${error.message}`, 'error');
        }
      });
  }

  editInsumo(insumo: any): void {
    console.log('Editar categoría:', insumo);
    // Aquí podrías redirigir a un formulario de edición
  }

  deleteInsumo(id: number): void {
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
