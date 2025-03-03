import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/models/product/services/product.service';
import { Producto } from '../../../shared/models/product/entities/Producto';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../environments/environment';
import { DefaultPaginationValue, Pagination } from '../../../shared/models/paginated.interface';
import { Dropdown, DropdownOptions, InstanceOptions } from 'flowbite';
import { InputComponent } from '../../../shared/components/input/input.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [CommonModule, OverlayModule, RouterModule, InputComponent, PaginationComponent],
  templateUrl: './inventories.component.html',
  styleUrl: './inventories.component.css'
})
export class InventoriesComponent {
  public pagination: Pagination<Producto> = DefaultPaginationValue;

  /* ButtonFilterDropdown */
  @ViewChild('buttonFilterDropdown', { read: ElementRef })
  public buttonFilterDropdown: ElementRef<HTMLButtonElement>;

  /* Modal */
  @ViewChild('filterDropdown', { read: ElementRef })
  public divFilterDropdown: ElementRef<HTMLDivElement>;

  /* Buttons of Dropdowns Menus */
  @ViewChildren('dropdownButton', { read: ElementRef })
  public buttons: QueryList<ElementRef<HTMLButtonElement>>;

  /* Dropdowns Menus */
  @ViewChildren('dropdownMenu', { read: ElementRef })
  public dropdownsMenu: QueryList<ElementRef<HTMLDivElement>>;

  /* Dropdowns */
  private filterDropdown: Dropdown;
  private dropdowns: Dropdown[] = [];

  private token: string;
  public page: number = 1;
  public searchTerm: string = '';
  public sortBy: string = '';

  constructor(
    private productoService: ProductService,
    private mensaje: MensajeService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    setTimeout(() => this.inicializarFilterDropdown());
    this.getProductos();
  }

  /* Inicializar Filter Dropdown */
  private inicializarFilterDropdown(): void {
    if (this.buttonFilterDropdown && this.divFilterDropdown) {
      const options: DropdownOptions = {
        triggerType: 'click',
        delay: 300,
        ignoreClickOutsideClass: false
      };

      const instanceOptions: InstanceOptions = {
        id: 'filterDropdown',
        override: true
      };

      this.filterDropdown = new Dropdown(this.divFilterDropdown.nativeElement, this.buttonFilterDropdown.nativeElement, options, instanceOptions);
    }
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

  private getProductos() {
    this.productoService.findAll(this.token, this.page, this.searchTerm, this.sortBy).subscribe({
      next: (data: Pagination<Producto>) => {
        this.pagination = data;
        setTimeout(() => this.inicializarDropdowns());
      },
      error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error')
    });
  }

  editProducto(producto: any): void {
    console.log('Editar producto:', producto);
  }

  /* Buscar Productos */
  searchProductos(search: string): void {
    this.searchTerm = search;
    this.getProductos();
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
    this.getProductos();
  }
}
