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
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DefaultPaginationValue, Pagination } from '../../../shared/models/paginated.interface';
import { Pedido } from '../../../shared/models/pedidos/entities/Pedido.interface';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Dropdown, InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { SearchArray } from '../../../shared/models/SearchArray.interface';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule, RouterLink, OverlayModule, ReactiveFormsModule, PaginationComponent, InputComponent],
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.css'
})
export class OrdersHistoryComponent implements OnInit, AfterViewInit {
  /* Inyectar Servicios */
  pedidosService = inject(PedidosService);
  mensaje = inject(MensajeService);
  cookieService = inject(CookieService);
  private fb = inject(FormBuilder);
  public cedula?: string;

  public form1: FormGroup = this.fb.group({
    idCliente: [''],
    estadoPedido: this.fb.array([]),
    estadoPago: this.fb.array([]),
    fechaPedido: [''],
    fechaEntrega: [''],
    evento: ['']
  });

  estados = ['Pendiente', 'En Proceso', 'Terminado', 'Incidencia'];
  estadosPagos = ['Pendiente', '50% Pagado', '100% Pagado'];
  public modal: Modal;

  token: string | undefined;

  public pagination: Pagination<Pedido> = DefaultPaginationValue;
  public page: number = 1;
  public search: string = '';
  public sortBy: string = '';
  public terminos: SearchArray[] = [];

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
    let estadosSeleccionados = this.form1.get('estadoPedido').value;
    let estadosPagosSeleccionados = this.form1.get('estadoPago').value;
    let fechaPedido = this.form1.get('fechaPedido').value;
    let fechaEntrega = this.form1.get('fechaEntrega').value;
    let evento = this.form1.get('evento').value;

    this.terminos = [];

    if (estadosSeleccionados) this.terminos.push({ term: 'estadoPedido', search: estadosSeleccionados });
    if (estadosPagosSeleccionados) this.terminos.push({ term: 'estadoPago', search: estadosPagosSeleccionados });
    if (fechaPedido) this.terminos.push({ term: 'fechaPedido', search: fechaPedido });
    if (fechaEntrega) this.terminos.push({ term: 'fechaEntrega', search: fechaEntrega });
    if (evento) this.terminos.push({ term: 'evento', search: evento });
    console.log('onSubmit',this.terminos)
    this.getPedidos();
  }

  private getPedidos() {
    this.pedidosService.filter(this.token, this.page, this.terminos, this.sortBy).subscribe({
      next: (data: Pagination<Pedido>) => {
        this.pagination = data;
        setTimeout(() => this.inicializarDropdowns()); 
      },
      error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error')
    });
  }

  /* Buscar Pedidos */
  searchPedidos(search: any): void {
    this.terminos = [];
    if(search) this.terminos.push({ term: 'cliente', search: search });
    this.getPedidos();
  }

  resetFilter(){
    this.form1.reset();
    this.terminos = [];
    this.getPedidos();
  }

  onCheckboxChange(event: any, tipo: string): void {
    if (tipo === 'Pedido') {
      const estadoPedido: FormArray = this.form1.get('estadoPedido') as FormArray;
      if (event.target.checked) {
        estadoPedido.push(this.fb.control(event.target.value));
      } else {
        const index = estadoPedido.controls.findIndex(x => x.value === event.target.value);
        estadoPedido.removeAt(index);
      }
    } else {
      const estadoPago: FormArray = this.form1.get('estadoPago') as FormArray;
      if (event.target.checked) {
        if (event.target.value === '50% Pagado' || event.target.value === '100% Pagado') {
          let textEncode = this.encodeToUrl(event.target.value);
          estadoPago.push(this.fb.control(textEncode));
        } else {
          estadoPago.push(this.fb.control(event.target.value));
        }
      } else {
        const indexPago = estadoPago.controls.findIndex(x => x.value === event.target.value);
        estadoPago.removeAt(indexPago);
      }
    }
  }

  encodeToUrl(texto: string): string {
    return encodeURIComponent(texto);
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

  /* Cerrar modal de filtros */
  public closeModal(): void {
    this.modal.hide();
  }
}
