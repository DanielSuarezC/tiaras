import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReembolsoService } from '../../../shared/models/reembolsos/services/Reembolso.service';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dropdown, InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { DefaultPaginationValue, Pagination } from '../../../shared/models/paginated.interface';
import { Reembolso } from '../../../shared/models/reembolsos/entities/Reembolso';
import { environment } from '../../../../../environments/environment';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-cancellations',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent, ReactiveFormsModule],
  templateUrl: './cancellations.component.html',
  styleUrl: './cancellations.component.css'
})
export class CancellationsComponent {
  reembolsosService = inject(ReembolsoService);
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

  public pagination: Pagination<Reembolso> = DefaultPaginationValue;
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
    this.getReembolsos();
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

  private getReembolsos() {
    this.reembolsosService.findAllPaginate(this.token, this.page, this.search, this.sortBy).subscribe({
      next: (data: Pagination<Reembolso>) => {
        this.pagination = data;
        console.log(this.pagination.data);
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
    this.getReembolsos();
  }
}
