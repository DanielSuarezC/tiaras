import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { InsumoStock } from '../../../../../../shared/models/inventarios/dto/insumo-stock.dto';
import { InventariosService } from '../../../../../../shared/models/inventarios/services/inventarios.service';
import { ActivatedRoute } from '@angular/router';
import { InputComponent } from '../../../../../../shared/components/input/input.component';
import { Pagination } from '../../../../../../shared/models/paginated.interface';
import { Dropdown, DropdownOptions, InstanceOptions } from 'flowbite';

@Component({
  selector: 'stock-insumos',
  standalone: true,
  imports: [CommonModule, InputComponent],
  templateUrl: './stock-insumos.component.html',
  styles: ``
})
export class StockInsumosComponent implements OnInit {
  public pagination: Pagination<InsumoStock> = {
    data: [],
    meta: { totalItems: 0, itemsPerPage: 10, totalPages: 1, currentPage: 1, sortBy: [[]] },
    links: { first: '', previous: '', next: '', last: '', current: '' }
  };;
  public idInventario: number;
  public page: number = 1;
  public searchTerm: string = '';
  public sortBy: string = '';

  /* Button Dropdown */
  @ViewChild('buttonSortDropdown')
  public buttonDropdown: ElementRef<HTMLButtonElement>;

  /* Div Dropdown */
  @ViewChild('sortDropdown')
  public divDropdown: ElementRef<HTMLDivElement>;

  /* Dropdown */
  public dropdown: Dropdown;
  
  /* Constructor */
  constructor(
    private inventariosService: InventariosService,
    private cookieService: CookieService,
    private route: ActivatedRoute
  ) {
    this.route.parent.paramMap.subscribe((params) => {
      this.idInventario = +params.get('idInventario');
    });
  }
  
  ngOnInit(): void {
    this.inventariosService.findInsumoStockPaginate(this.idInventario, this.cookieService.get(environment.nombreCookieToken), this.page, this.searchTerm, this.sortBy)
      .subscribe((res) => {
        this.pagination = res;

        setTimeout(() => {
          this.initDropdown();
        });
    });
  }

  /* Inicializar Dropdown */
  public initDropdown() {
    const options: DropdownOptions = {
      placement: 'bottom',
      triggerType: 'click',
      delay: 300,
      ignoreClickOutsideClass: false
    };
  
    const instanceOptions: InstanceOptions = {
      id: 'sortDropdown'
    };

    this.dropdown = new Dropdown(this.buttonDropdown.nativeElement, this.divDropdown.nativeElement, options, instanceOptions);
  }

  /* Buscar insumo */
  public searchInsumo(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.consultarInsumos();
  }

  /* Ordenar por */
  public ordenarPor(sortBy: string) {
    this.sortBy = sortBy;
    this.consultarInsumos();
  }

  /* Cambiar página */
  public cambiarPagina(page: number) {
    this.page = page;
    this.consultarInsumos();
  }

  /* Consultar Insumos en el Inventario */
  public consultarInsumos() {
    this.inventariosService.findInsumoStockPaginate(this.idInventario, this.cookieService.get(environment.nombreCookieToken), this.page, this.searchTerm, this.sortBy)
      .subscribe((res) => {
        this.pagination = res;
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
}
