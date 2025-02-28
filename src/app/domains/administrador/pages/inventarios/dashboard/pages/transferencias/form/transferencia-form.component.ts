import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Inventario } from '../../../../../../../shared/models/inventarios/entities/inventario.entity';
import { Insumo } from '../../../../../../../shared/models/insumos/entities/Insumo';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MensajeService } from '../../../../../../../shared/mensaje/mensaje.service';
import { InventariosService } from '../../../../../../../shared/models/inventarios/services/inventarios.service';
import { InsumosService } from '../../../../../../../shared/models/insumos/services/insumos.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'transferencia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transferencia-form.component.html',
  styles: ``
})
export class TransferenciasFormComponent implements OnInit, OnDestroy {
  public inventariosDestino: Inventario[];
  public insumosSeleccionados: { insumo: Insumo, cantidad: number }[] = [];
  public insumosSearch: Insumo[] = [];
  public insumosOnInventario: Insumo[] = [];

  private token: string;
  private idInventario: number;
  public mostrarDropdown = false;

  /* Debouncer */
  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSubscription?: Subscription;

  constructor(
    private inventarioService: InventariosService,
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
        .subscribe((value: string) => this.onInsumoSearch(value));
  }

  ngOnDestroy(): void {
    this.debouncerSubscription.unsubscribe();
  }

  public transferForm = this.fb.group({
    inventarioDestino: ['', Validators.required],
    insumoSearch: [''],
    insumoStock: ['', [Validators.required, Validators.min(1)]]
  });

  private loadInventarios() {
    this.inventarioService.findAll(this.token).subscribe({
      next: (data) => {
        this.inventariosDestino = data.filter(i => i.idInventario !== this.idInventario);
      },
      error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.message}`, 'error')
    });

    this.inventarioService.findInsumoStockPaginate(this.idInventario, this.token, 1).subscribe({
      next: (data) => this.insumosOnInventario = data.data.map(i => i.insumo),
      error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.message}`, 'error')
    });
  }

  onInsumoSearch(searchTerm: string) {
    if (searchTerm && searchTerm.trim().length > 0) {
      this.inventarioService.findInsumoStockPaginate(this.idInventario, this.token, 1, searchTerm).subscribe({
        next: (data) => this.insumosSearch = data.data.map(i => i.insumo),
        error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.message}`, 'error')
      });
    } else {
      this.insumosSearch = [];
    }
  }

  ocultarDropdownConRetraso() {
    setTimeout(() => {
      this.mostrarDropdown = false;
    }, 200);
  }

  selectInsumo(insumo: Insumo) {
    this.transferForm.get('insumoSearch')?.setValue(insumo.nombre);
    this.insumosSearch = [];
  }  

  addInsumo() {
    const insumo = this.insumosOnInventario.find(i => i.nombre === this.transferForm.get('insumoSearch')?.value);
    if (!insumo) {
      this.mensaje.showMessage('Error', 'Seleccione un insumo de la lista', 'error');
      return;
    }

    const stock = this.transferForm.get('insumoStock')?.value;
    if (!stock) {
      this.mensaje.showMessage('Error', 'Ingrese la cantidad del producto', 'error');
      return;
    }

    this.insumosSeleccionados = [ ...this.insumosSeleccionados, { insumo, cantidad: +stock } ];

    this.transferForm.get('insumoSearch')?.reset();
    this.transferForm.get('insumoStock')?.reset();
  }

  removeProduct(insumo: Insumo) {
    this.insumosSeleccionados.filter(i => i.insumo.idInsumo !== insumo.idInsumo);
  }

  onSubmit() {
    if (this.insumosSeleccionados.length === 0) {
      this.mensaje.showMessage('Error', 'Complete todos los campos requeridos', 'error');
      return;
    }

    const idInventarioDestino: number = +this.transferForm.get('inventarioDestino')?.value;
    if (!idInventarioDestino) {
      this.mensaje.showMessage('Error', 'Seleccione un inventario de destino', 'error');
      return;
    }

    const insumos = this.insumosSeleccionados.map(i => ({ idInsumo: i.insumo.idInsumo, cantidad: i.cantidad }));

    this.inventarioService.transferirInsumos(this.idInventario, idInventarioDestino, this.token, insumos).subscribe({
      next: () => {
        this.mensaje.showMessage('Éxito', 'Transferencia realizada con éxito', 'success');
        this.insumosSeleccionados = [];
        this.transferForm.reset();
      },
      error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.message}`, 'error')
    });
  }

  onKeyPress(dato: string){
    this.debouncer.next(dato);
  }
}
