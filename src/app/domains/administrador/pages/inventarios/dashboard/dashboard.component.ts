import { Component, Input, OnInit } from '@angular/core';
import { InventarioSidebarComponent } from './components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { InventariosService } from '../../../../shared/models/inventarios/services/inventarios.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../environments/environment';
import { InventarioStock } from '../../../../shared/models/inventarios/dto/inventario-stock.dto';

@Component({
  selector: 'inventarios-dashboard',
  standalone: true,
  imports: [RouterOutlet, InventarioSidebarComponent],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class InventarioDashboardComponent implements OnInit {
  @Input()
  public idInventario: number;

  public inventarioName: string;

  public inventarioStock: InventarioStock;

  /* Constructor */
  constructor(
    private inventariosService: InventariosService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.inventariosService.findById(this.idInventario, this.cookieService.get(environment.nombreCookieToken)).subscribe((inventario) => this.inventarioName = inventario.nombre);
  }
}
