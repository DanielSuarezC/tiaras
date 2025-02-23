import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';
import { InsumosService } from '../../../shared/models/insumos/services/insumos.service';
import { CookieService } from 'ngx-cookie-service';
import { Insumo } from '../../../shared/models/insumos/entities/Insumo';
import { environment } from '../../../../../environments/environment';
import { DialogModule } from '@angular/cdk/dialog';
import Swal from 'sweetalert2';
import { InputComponent } from "../../../shared/components/input/input.component";
import { Dropdown, DropdownOptions, InstanceOptions } from 'flowbite';
import { DefaultPaginationValue, Pagination } from '../../../shared/models/paginated.interface';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [CommonModule, OverlayModule, RouterModule, DialogModule, InputComponent, PaginationComponent],
  templateUrl: './insumos.component.html',
  styleUrl: './insumos.component.css'
})
export class InsumosComponent {
  public pagination: Pagination<Insumo> = DefaultPaginationValue;

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
    private insumosService: InsumosService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    setTimeout(() => this.inicializarFilterDropdown());
    this.getInsumos();
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

  private getInsumos() {
    this.insumosService.findAll(this.token, this.page, this.searchTerm, this.sortBy).subscribe({
      next: (data: Pagination<Insumo>) => {
        this.pagination = data;
        setTimeout(() => this.inicializarDropdowns());
      },
      error: (error) => Swal.fire('Error', `Error de obtención de datos.  ${error.message}`, 'error')
    });
  }

  editInsumo(insumo: any): void {
    console.log('Editar categoría:', insumo);
  }

  searchInsumos(search: string): void {
    this.searchTerm = search;
    this.getInsumos();
  }

  deleteInsumo(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      console.log('Eliminar categoría con ID:', id);
    }
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
    this.getInsumos();
  }
}
