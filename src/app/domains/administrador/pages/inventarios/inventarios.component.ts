import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { InventariosService } from '../../../shared/models/inventarios/services/inventarios.service';
import { CookieService } from 'ngx-cookie-service';
import { Inventario } from '../../../shared/models/inventarios/entities/inventario.entity';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Dropdown, InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateInventarioDto } from '../../../shared/models/inventarios/dto/create-inventario.dto';
import { RouterLink } from '@angular/router';
import { DefaultPaginationValue, Pagination } from '../../../shared/models/paginated.interface';
import { InputComponent } from '../../../shared/components/input/input.component';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-inventarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, PaginationComponent],
  templateUrl: './inventarios.component.html',
  styles: []
})
export class InventariosComponent implements OnInit {
  public pagination: Pagination<Inventario> = DefaultPaginationValue;

  /* ButtonModal */
  @ViewChild('buttonModal', { read: ElementRef })
  public buttonModal: ElementRef<HTMLButtonElement>;

  /* Modal */
  @ViewChild('formModal', { read: ElementRef })
  public modal: ElementRef<HTMLDivElement>;

  /* Buttons of Dropdowns Menus */
  @ViewChildren('dropdownButton', { read: ElementRef })
  public buttons: QueryList<ElementRef<HTMLButtonElement>>;

  /* Dropdowns Menus */
  @ViewChildren('dropdownMenu', { read: ElementRef })
  public dropdownsMenu: QueryList<ElementRef<HTMLDivElement>>;

  /* FormModal */
  private formModal: Modal;

  /* Dropdowns */
  private dropdowns: Dropdown[] = [];

  /* Page */
  public page: number = 1;

  constructor(
    private inventariosService: InventariosService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder
  ) {}

  /* Formulario */
  public formInventario: FormGroup = this.formBuilder.group({
    idInventario: [null],
    nombre: ['', [ Validators.required, Validators.minLength(3) ]],
    descripcion: ['', [ Validators.required, Validators.minLength(10) ]],
  });

  /* NgOnInit */
  ngOnInit(): void {
    this.inventariosService.findAllPaginate(this.page, this.cookieService.get(environment.nombreCookieToken)).subscribe((res) => {
      this.pagination = res;

      setTimeout(() => {
        this.inicializarFormModal();
        this.inicializarDropdowns();
      });
    });
  }

  /* Inicializar FormModal */
  private inicializarFormModal(): void {
    const options: ModalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      closable: true,
      onHide: () => {
        this.formInventario.reset();
      }
    };

    const instanceOptions: InstanceOptions = {
      id: 'formModal',
      override: true
    }

    this.formModal = new Modal(this.modal.nativeElement, options, instanceOptions);
    this.buttonModal.nativeElement.addEventListener('click', () => this.formModal.show());
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

  /* Enviar Formulario */
  public enviarFormulario(): void {
    const { idInventario, nombre, descripcion } = this.formInventario.value;
    
    if (this.formInventario.valid) {
      const createInventarioDto: CreateInventarioDto = { nombre, descripcion };

      if (this.formInventario.get('idInventario')?.value !== null) {
        this.actualizarInventario(idInventario, createInventarioDto);
      } else {
        this.crearInventario(createInventarioDto);
      }
    }
  }

  /* Crear Inventario */
  private crearInventario(createInventarioDto: CreateInventarioDto ): void {
    this.inventariosService.create(createInventarioDto, this.cookieService.get(environment.nombreCookieToken)).subscribe({
      next: (res) => {
        this.pagination.data.push(res);
        this.formInventario.reset();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  /* Actualizar Inventario */
  public actualizarInventario(idInventario: number, createInventarioDto: CreateInventarioDto ): void {
    this.inventariosService.update(idInventario, createInventarioDto, this.cookieService.get(environment.nombreCookieToken)).subscribe((res) => {
      if (res.affected === 1) {
        const index = this.pagination.data.findIndex((inventario) => inventario.idInventario === idInventario);
        this.pagination.data[index] = { ...this.pagination.data[index], ...createInventarioDto };
        this.formInventario.reset();
        this.formModal.hide();
      }
    });
  }

  /* Editar Inventario */
  public editarInventario(inventario: Inventario): void {
    this.formInventario.patchValue(inventario);
    this.formModal.show();
  }

  /* Eliminar Inventario */
  public eliminarInventario(): void {
    console.log('Inventario Eliminado!');
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
    this.inventariosService.findAllPaginate(this.page, this.cookieService.get(environment.nombreCookieToken)).subscribe((res) => {
      this.pagination = res;

      setTimeout(() => this.inicializarDropdowns());
    });
  }
}
