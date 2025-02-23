import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { CategoryService } from '../../../shared/models/categorias/services/category.service';
import { Categoria } from '../../../shared/models/categorias/entities/Categoria';
import { environment } from '../../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { DialogModule } from '@angular/cdk/dialog';
import Swal from 'sweetalert2';
import { InputComponent } from "../../../shared/components/input/input.component";
import { DefaultPaginationValue, Pagination } from '../../../shared/models/paginated.interface';
import { Dropdown, DropdownOptions, InstanceOptions } from 'flowbite';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, OverlayModule, RouterModule, CdkTableModule, DialogModule, InputComponent, PaginationComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  public pagination: Pagination<Categoria> = DefaultPaginationValue;

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
    private categoryService: CategoryService,
    private cookieService: CookieService
  ) { }


  ngOnInit(): void {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    setTimeout(() => this.inicializarFilterDropdown());
    this.getCategories();
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

  private getCategories() {
    this.categoryService.findAll(this.token, this.page, this.searchTerm, this.sortBy).subscribe({
      next: (data: Pagination<Categoria>) => {
        this.pagination = data;
        setTimeout(() => this.inicializarDropdowns());
      },
      error: (error) => Swal.fire('Error', `Error de obtención de datos.  ${error.message}`, 'error')
    });
  }

  editCategory(category: any): void {
    console.log('Editar categoría:', category);
  }

  deleteCategory(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      console.log('Eliminar categoría con ID:', id);
    }
  }

  /* Buscar Categoría */
  public searchCategory(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.getCategories();
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
    this.getCategories();
  }
}
