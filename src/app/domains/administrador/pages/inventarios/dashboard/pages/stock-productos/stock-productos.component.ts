import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductoStock } from '../../../../../../shared/models/inventarios/dto/producto-stock.dto';
import { InventariosService } from '../../../../../../shared/models/inventarios/services/inventarios.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../../../environments/environment';
import { DefaultPaginationValue, Pagination } from '../../../../../../shared/models/paginated.interface';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';
import { InputComponent } from '../../../../../../shared/components/input/input.component';

@Component({
  selector: 'app-stock-productos',
  standalone: true,
  imports: [CommonModule, InputComponent, PaginationComponent],
  templateUrl: './stock-productos.component.html',
  styles: ``
})
export class StockProductosComponent {
  public idInventario: number;
  public pagination: Pagination<ProductoStock> = DefaultPaginationValue;
  public page: number = 1;
  public searchTerm: string = '';
  public sortBy: string = '';

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
    this.consultarProductos();
  }

  /* Buscar insumo */
  public searchProducto(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.consultarProductos();
  }

  /* Ordenar por */
  public ordenarPor(sortBy: string) {
    this.sortBy = sortBy;
    this.consultarProductos();
  }

  /* Cambiar página */
  public cambiarPagina(page: number) {
    this.page = page;
    this.consultarProductos();
  }

  /* Consultar Insumos en el Inventario */
  public consultarProductos() {
    this.inventariosService.findProductoStockPaginate(this.idInventario, this.cookieService.get(environment.nombreCookieToken), this.page, this.searchTerm, this.sortBy)
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
