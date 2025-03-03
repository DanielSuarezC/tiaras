import { Component, OnInit } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { InsumoStock } from '../../../../../../shared/models/inventarios/dto/insumo-stock.dto';
import { InventariosService } from '../../../../../../shared/models/inventarios/services/inventarios.service';
import { MensajeService } from '../../../../../../shared/mensaje/mensaje.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../../../environments/environment';
import { Insumo } from '../../../../../../shared/models/insumos/entities/Insumo';
import { CommonModule } from '@angular/common';
import { InsumosService } from '../../../../../../shared/models/insumos/services/insumos.service';
import { Pagination } from '../../../../../../shared/models/paginated.interface';

@Component({
  selector: 'app-addStockInsumos',
  standalone: true,
  imports:[CommonModule, ReactiveFormsModule],
  templateUrl: './addStockInsumos.component.html',
  styles: ''
})
export class AddStockInsumosComponent implements OnInit {

    public insumosSeleccionados: { insumo: InsumoStock, cantidad: number }[] = [];
    public insumosSearch: Insumo[] = [];
    public insumoSeleccionado: Insumo;
    public insumosOnInventario: InsumoStock[] = [];
    public searchTerm: string = '';
    
  
    private token: string;
    private idInventario: number;
    public mostrarDropdown = false;
  
    /* Debouncer */
    private debouncer: Subject<string> = new Subject<string>();
    private debouncerSubscription?: Subscription;
  
    constructor(
      private inventarioService: InventariosService,
      private insumosService: InsumosService,
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
      insumoSearch: [''],
      insumoStock: ['', [Validators.required, Validators.min(1)]],
    });
  
    private loadInventarios() {  
      this.inventarioService.findInsumoStockPaginate(this.idInventario, this.token, 1).subscribe({
        next: (data) => this.insumosOnInventario = data.data,
        error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.message}`, 'error')
      });
    }
  
    onInsumoSearch(searchTerm: string) {
      if (searchTerm && searchTerm.trim().length > 0) {
         this.insumosService.findAll(this.token, 1, this.searchTerm).subscribe({
              next: (data: Pagination<Insumo>) => {
                this.insumosSearch = data.data;
              },
              error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.error.message}`, 'error')
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
      this.insumoSeleccionado = insumo;
      this.insumosSearch = [];
    }  
  
    addInsumo() {
      let insumo = this.insumosOnInventario.find(i => i.insumo.nombre === this.transferForm.get('insumoSearch')?.value);

      /* Si el insumo no tiene stock en el inventario, se crea InsumoStock de ese insumo*/
      if (!insumo) {
        insumo = {idInsumoStock: this.insumoSeleccionado.idInsumo, insumo: this.insumoSeleccionado , stock:0} as InsumoStock;  
      }
  
      const stock = Number(this.transferForm.get('insumoStock')?.value);
      if (!stock) {
        this.mensaje.showMessage('Error', 'Ingrese la cantidad del producto', 'error');
        return;
      }
  
      /* Validar si el Insumo ya fue seleccionado */
      if (this.insumosSeleccionados.find(i => i.insumo.insumo.idInsumo === insumo.insumo.idInsumo)) {
        this.insumosSeleccionados = this.insumosSeleccionados.map(i => {
          if (i.insumo.insumo.idInsumo === insumo.insumo.idInsumo) {
            i.cantidad = stock;
          }
          return i;
        });
        
        this.transferForm.get('insumoSearch')?.reset();
        this.transferForm.get('insumoStock')?.reset();
        
        return;
      }
  
      this.insumosSeleccionados = [ ...this.insumosSeleccionados, { insumo, cantidad: +stock } ];

      console.log(this.insumosSeleccionados);
  
      this.transferForm.get('insumoSearch')?.reset();
      this.transferForm.get('insumoStock')?.reset();
    }
  
    editInsumo(insumo: Insumo) {
      const insumoSeleccionado = this.insumosSeleccionados.find(i => i.insumo.insumo.idInsumo === insumo.idInsumo);
      if (!insumoSeleccionado) {
        this.mensaje.showMessage('Error', 'Error al editar el insumo', 'error');
        return;
      }

      this.transferForm.get('insumoSearch')?.setValue(insumo.nombre);
      this.transferForm.get('insumoStock')?.setValue(insumoSeleccionado.cantidad.toString());
      this.insumoSeleccionado = insumo;
    }
  
    removeInsumo(insumo: Insumo) {
      this.insumosSeleccionados = this.insumosSeleccionados.filter(i => i.insumo.insumo.idInsumo !== insumo.idInsumo);
    }
  
    onSubmit() {
      if (this.insumosSeleccionados.length === 0) {
        this.mensaje.showMessage('Error', 'Complete todos los campos requeridos', 'error');
        return;
      }
  
      const insumos = this.insumosSeleccionados.map(i => ({ idInsumo: i.insumo.insumo.idInsumo, cantidad: i.cantidad }));

      this.inventarioService.addInsumoStock(this.idInventario, insumos, this.token).subscribe({
        next: () => {
          this.mensaje.showMessage('Éxito', 'Insumos agregados con éxito', 'success');
          this.insumosSeleccionados = [];
          this.transferForm.reset();
        },
        error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.error.message}`, 'error')
      });
    }
  
    onKeyPress(dato: string){
      this.debouncer.next(dato);
      this.searchTerm = dato;
    }

}
