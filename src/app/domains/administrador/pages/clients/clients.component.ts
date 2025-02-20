import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';
import { ClientesService } from '../../../shared/models/clientes/services/clientes.service';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';
import { CookieService } from 'ngx-cookie-service';
import { cliente } from '../../../shared/models/clientes/entities/cliente';
import { environment } from '../../../../../environments/environment';
import { DefaultPaginationValue, Pagination } from '../../../shared/models/paginated.interface';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { Cliente } from '../../../shared/models/pedidos/entities/Pedido.interface';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, OverlayModule, RouterModule, InputComponent, PaginationComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  clienteService = inject(ClientesService);
  private mensaje = inject(MensajeService);
  private cookieService = inject(CookieService);

  public pagination: Pagination<Cliente> = DefaultPaginationValue;
  public page: number = 1;
  public search: string = '';
  public sortBy: string = '';

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
    this.clienteService.findAllPaginate(this.token, this.page).subscribe({
      next: (data: Pagination<cliente>) => this.pagination = data,
      error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error')
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

  /* Buscar Cliente */
  public searchCliente(searchTerm: string) {
    this.search = searchTerm;
    this.consultarCliente();
  }

  /* Páginas */
  generateNumbers(): number[] {
    const numbers: number[] = [];
    for (let i = 1; i <= this.pagination?.meta.totalPages; i++) {
      numbers.push(i);
    }

    return numbers;
  }

  /* Cambiar Página */
  public cambiarPagina(page: number): void {
    this.page = page;
    this.clienteService.findAllPaginate(this.cookieService.get(environment.nombreCookieToken), this.page).subscribe((res) => {
      this.pagination = res;
    });
  }

  /* Consultar Clientes */
  public consultarCliente() {
    this.clienteService.findAllPaginate(this.cookieService.get(environment.nombreCookieToken), this.page, this.search, this.sortBy)
      .subscribe((res) => {
        this.pagination = res;
    });
  }
}
