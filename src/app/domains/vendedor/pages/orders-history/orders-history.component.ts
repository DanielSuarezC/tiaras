import { AfterViewInit, Component, ElementRef, inject, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PedidosService } from '../../../shared/models/pedidos/services/pedidos.service';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';
import { CookieService } from 'ngx-cookie-service';
import { pedido } from '../../../shared/models/pedidos/entities/pedido';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ClientesService } from '../../../shared/models/clientes/services/clientes.service';
import { cliente } from '../../../shared/models/clientes/entities/cliente';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DefaultPaginationValue, Pagination } from '../../../shared/models/paginated.interface';
import { Pedido } from '../../../shared/models/pedidos/entities/Pedido.interface';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Dropdown, InstanceOptions, Modal, ModalOptions } from 'flowbite';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule, RouterLink, OverlayModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.css'
})
export class OrdersHistoryComponent implements OnInit, AfterViewInit {
  /* Inyectar Servicios */
  pedidosService = inject(PedidosService);
  mensaje = inject(MensajeService);
  cookieService = inject(CookieService);
  private fb = inject(FormBuilder);
  cedula?: string;

  public form1: FormGroup = this.fb.group({
    idCliente: [''],
    estadoPedido: [''],
    estadoPago: [''],
    fechaPedido: [''],
    fechaEntrega: [''],
  });

  public modal: Modal;

  token: string | undefined;

  public pagination: Pagination<Pedido> = DefaultPaginationValue;
  public page: number = 1;
  public search: string = '';
  public sortBy: string = '';

  /* Buttons of Dropdowns Menus */
  @ViewChildren('dropdownButton', { read: ElementRef })
  public buttons: QueryList<ElementRef<HTMLButtonElement>>;

  /* Dropdowns Menus */
  @ViewChildren('dropdownMenu', { read: ElementRef })
  public dropdownsMenu: QueryList<ElementRef<HTMLDivElement>>;

  /* Dropdowns */
  private dropdowns: Dropdown[] = [];

  ngOnInit() {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.getPedidos();
  }

  ngAfterViewInit(): void {
    const modalOptions: ModalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      closable: true
    };

    const instanceOptions: InstanceOptions = {
      id: 'filterModal',
      override: true
    };

    const buttonModal: HTMLElement = document.getElementById('buttonModal');
    const filterModal: HTMLElement = document.getElementById('filterModal');
    this.modal = new Modal(filterModal, modalOptions, instanceOptions);
    buttonModal.addEventListener('click', () => this.modal.show());

    console.log(this.dropdowns);
  }

  /* Inicializar Dropdowns */
  private inicializarDropdowns(): void {
    if (this.buttons.length > 0 && this.dropdownsMenu.length > 0) {
      this.dropdowns = [];

      this.buttons.forEach((button, index) => {
        const menu = this.dropdownsMenu.get(index);
        if (menu) {
          const dropdown = new Dropdown(menu.nativeElement, button.nativeElement);
          this.dropdowns.push(dropdown);
        }
      });
    }
  }

  OnSubmit() {

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

  private getPedidos() {
    this.pedidosService.findAllPaginate(this.token, this.page, this.search, this.sortBy).subscribe({
      next: (data: Pagination<Pedido>) => {
        this.pagination = data;

        setTimeout(() => this.inicializarDropdowns());
      },
      error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error')
    });
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
    this.getPedidos();
  }

  /* buscarCliente(dato: string) {
    this.clientes.set([]);
    this.cedula = dato;
    this.getClientesByCedula();
    console.log(`dato: ${dato} `);
  }
 */
}
