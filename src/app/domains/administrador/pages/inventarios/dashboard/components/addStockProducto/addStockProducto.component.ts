import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../../../../shared/models/product/entities/Producto';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { InventariosService } from '../../../../../../shared/models/inventarios/services/inventarios.service';
import { ProductService } from '../../../../../../shared/models/product/services/product.service';
import { MensajeService } from '../../../../../../shared/mensaje/mensaje.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../../../../../../environments/environment';
import { Pagination } from '../../../../../../shared/models/paginated.interface';
import { ProductoStock } from '../../../../../../shared/models/inventarios/dto/producto-stock.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addStockProducto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addStockProducto.component.html',
  styles: ''
})
export class AddStockProductoComponent implements OnInit {
  public productosSeleccionados: { producto: ProductoStock, cantidad: number }[] = [];
  public productoSearch: Producto[] = [];
  public ProductoSeleccionado: Producto;
  public ProductosOnInventario: ProductoStock[] = [];
  public searchTerm: string = '';


  private token: string;
  private idInventario: number;
  public mostrarDropdown = false;

  /* Debouncer */
  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSubscription?: Subscription;

  constructor(
    private inventarioService: InventariosService,
    private productosService: ProductService,
    private mensaje: MensajeService,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idInventario = +this.route.parent.snapshot.paramMap.get('idInventario');
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.loadInventarios();

    this.debouncerSubscription = this.debouncer
      .pipe(debounceTime(500))
      .subscribe((value: string) => this.onProductoSearch(value));
  }

  ngOnDestroy(): void {
    this.debouncerSubscription.unsubscribe();
  }

  public form = this.fb.group({
    productoSearch: [''],
    productoStock: ['', [Validators.required, Validators.min(1)]],
  });

  private loadInventarios() {
    this.inventarioService.findProductoStockPaginate(this.idInventario, this.token, 1).subscribe({
      next: (data) => this.ProductosOnInventario = data.data,
      error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.error.message}`, 'error')
    });
  }

  onProductoSearch(searchTerm: string) {
    if (searchTerm && searchTerm.trim().length > 0) {
      this.productosService.findAll(this.token, 1, this.searchTerm).subscribe({
        next: (data: Pagination<Producto>) => {
          this.productoSearch = data.data;
        },
        error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.error.message}`, 'error')
      });
    } else {
      this.productoSearch = [];
    }
  }

  ocultarDropdownConRetraso() {
    setTimeout(() => {
      this.mostrarDropdown = false;
    }, 200);
  }

  selectProducto(producto: Producto) {
    this.form.get('productoSearch')?.setValue(producto.nombre);
    this.ProductoSeleccionado = producto;
    this.productoSearch = [];
  }

  addProducto() {
    let producto = this.ProductosOnInventario.find(i => i.producto.nombre === this.form.get('productoSearch')?.value);

    /* Si el insumo no tiene stock en el inventario, se crea productoStock de ese insumo*/
    if (!producto) {
      producto = { idProductoStock: this.ProductoSeleccionado.idProducto, producto: this.ProductoSeleccionado, stock: 0 } as ProductoStock;
    }

    const stock = Number(this.form.get('productoStock')?.value);
    if (!stock) {
      this.mensaje.showMessage('Error', 'Ingrese la cantidad del producto', 'error');
      return;
    }

    /* Validar si el Insumo ya fue seleccionado */
    if (this.productosSeleccionados.find(p => p.producto.producto.idProducto === producto.producto.idProducto)) {
      this.productosSeleccionados = this.productosSeleccionados.map(p => {
        if (p.producto.producto.idProducto === producto.producto.idProducto) {
          p.cantidad = stock;
        }
        return p;
      });

      this.form.get('productoSearch')?.reset();
      this.form.get('productoStock')?.reset();

      return;
    }

    this.productosSeleccionados = [...this.productosSeleccionados, { producto: producto, cantidad: +stock }];

    this.form.get('productoSearch')?.reset();
    this.form.get('productoStock')?.reset();
  }

  editProducto(producto: Producto) {
    const productoSeleccionado = this.productosSeleccionados.find(p => p.producto.producto.idProducto === producto.idProducto);
    if (!productoSeleccionado) {
      this.mensaje.showMessage('Error', 'Error al editar el insumo', 'error');
      return;
    }

    this.form.get('productoSearch')?.setValue(producto.nombre);
    this.form.get('productoStock')?.setValue(productoSeleccionado.cantidad.toString());
    this.ProductoSeleccionado = producto;
  }

  removeProducto(producto: Producto) {
    this.productosSeleccionados = this.productosSeleccionados.filter(p => p.producto.producto.idProducto !== producto.idProducto);
  }

  onSubmit() {
    if (this.productosSeleccionados.length === 0) {
      this.mensaje.showMessage('Error', 'Complete todos los campos requeridos', 'error');
      return;
    }

    const productos = this.productosSeleccionados.map(i => ({ idProducto: i.producto.producto.idProducto, cantidad: i.cantidad }));

    this.inventarioService.addProductoStock(this.idInventario, productos, this.token).subscribe({
      next: () => {
        this.mensaje.showMessage('Éxito', 'Productos agregados con éxito', 'success');
        this.productosSeleccionados = [];
        this.form.reset();
      },
      error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.error.message}`, 'error')
    });
  }

  onKeyPress(dato: string) {
    this.debouncer.next(dato);
    this.searchTerm = dato;
  }

}
