import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { InsumoStock } from '../../../../../../shared/models/inventarios/dto/insumo-stock.dto';
import { InventariosService } from '../../../../../../shared/models/inventarios/services/inventarios.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InputComponent } from '../../../../../../shared/components/input/input.component';
import { DefaultPaginationValue, Pagination } from '../../../../../../shared/models/paginated.interface';
import { Dropdown, DropdownOptions, InstanceOptions } from 'flowbite';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'stock-insumos',
  standalone: true,
  imports: [CommonModule, InputComponent, PaginationComponent, RouterLink, OverlayModule],
  templateUrl: './stock-insumos.component.html',
  styles: ``
})
export class StockInsumosComponent implements OnInit {
  public pagination: Pagination<InsumoStock> = DefaultPaginationValue;

  @ViewChild('buttonDropdown', { read: ElementRef })
  public buttonDropdown: ElementRef<HTMLButtonElement>;

  @ViewChild('sortDropdown', { read: ElementRef })
  public sortDropdown: ElementRef<HTMLDivElement>;
  
  public idInventario: number;
  public page: number = 1;
  public searchTerm: string = '';
  public sortBy: string = '';

  /* Dropdown */
  public dropdown: Dropdown;

  public mostrarDropdown = false;
  
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
    this.consultarInsumos();
    // setTimeout(() => this.initDropdown());
  }

  // ngAfterViewInit(): void {
  //   setTimeout(() => this.initDropdown());
  // }

  /* Inicializar Dropdown */
  public initDropdown() {
    const options: DropdownOptions = {
      triggerType: 'click',
      delay: 300,
      ignoreClickOutsideClass: false
    };
  
    const instanceOptions: InstanceOptions = {
      id: 'sortDropdown',
      override: true
    };
    
    this.dropdown = new Dropdown(this.buttonDropdown.nativeElement, this.sortDropdown.nativeElement, options, instanceOptions);
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
