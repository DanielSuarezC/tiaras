import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';



import { RouterModule } from '@angular/router';
import { ClientesService } from '../../../shared/models/clientes/services/clientes.service';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';
import { CookieService } from 'ngx-cookie-service';
import { cliente } from '../../../shared/models/clientes/entities/cliente';
import { environment } from '../../../../../environments/environment';



@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, OverlayModule, RouterModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  clienteService = inject(ClientesService);
  private mensaje = inject(MensajeService);
  private cookieService = inject(CookieService);
  clientes = signal<cliente[]>([]);

  isOpenActions = false;
  isOpenFilters = false;
  openDropdownIndex: number | null = null;

  private token?: string;

  ngOnInit(): void {
    this.getClientes();
  }

  private getClientes() {
    // this.blockUICategories?.start('Loading...')
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.clienteService.findAll(this.token)
      .subscribe({
        next: (data: cliente[]) => {
          this.clientes.set(data);
          // this.blockUICategories?.stop();
        },
        error: (error) => {
          // this.blockUICategories?.stop();
          this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
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
