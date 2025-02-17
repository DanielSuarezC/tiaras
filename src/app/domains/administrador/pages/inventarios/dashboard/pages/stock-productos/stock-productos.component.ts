import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductoStock } from '../../../../../../shared/models/inventarios/dto/producto-stock.dto';
import { InventariosService } from '../../../../../../shared/models/inventarios/services/inventarios.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-stock-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-productos.component.html',
  styles: ``
})
export class StockProductosComponent {
  public productos: ProductoStock[] = [];

  /* Constructor */
  constructor(
    private inventariosService: InventariosService,
    private cookieService: CookieService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe((params) => {
      const idInventario = +params.get('idInventario');
      this.inventariosService.findProductoStock(idInventario, this.cookieService.get(environment.nombreCookieToken)).subscribe((productos) => this.productos = productos);
    });
  }
}
