import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PedidosService } from '../../../shared/models/pedidos/services/pedidos.service';
import { MensajeService } from '../../../shared/mensaje/mensaje.service';
import { CookieService } from 'ngx-cookie-service';
import { pedido } from '../../../shared/models/pedidos/entities/pedido';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ClientesService } from '../../../shared/models/clientes/services/clientes.service';
import { cliente } from '../../../shared/models/clientes/entities/cliente';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule,RouterLink, OverlayModule, InputComponent, ReactiveFormsModule],
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.css'
})
export class OrdersHistoryComponent {
  // Inyectar servicios
    pedidosService = inject(PedidosService);
    mensaje = inject(MensajeService);
    cookieService = inject(CookieService);
    pedidos = signal<pedido[]>([]);
    private clienteService = inject(ClientesService);
    private fb = inject(FormBuilder);
    clientes = signal<cliente[]>([]);
    cedula?: string;
    // productos: Producto[] = [];

    public form1: FormGroup = this.fb.group({
        idCliente: [''],
        estadoPedido: [''],
        estadoPago: [''],
        fechaPedido: [''],
        fechaEntrega: [''],
      });
  
    openDropdownIndex: number | null = null;
    isOpenFilters = false;
    isOpenDropdown = false;
  
    token: string | undefined;
  
    ngOnInit(){
      this.token = this.cookieService.get(environment.nombreCookieToken);
      this.getPedidos();
      this.getClientes();
    }

    OnSubmit(){

    }
  
    // Método para cerrar el dropdown
    closeDropdown() {
      this.isOpenDropdown = false;
    }
    closeFilter() {
      this.isOpenFilters = false;
    }
    editProducto(producto: any): void {
      console.log('Editar producto:', producto);
      // Aquí podrías redirigir a un formulario de edición
    }
  
    deleteProducto(id: number): void {
      if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        console.log('Eliminar producto con ID:', id);
        // Llamada al servicio para eliminar la categoría
      }
    }
    
    // Método para alternar el estado del menú
    toggleDropdown(index: number): void {
      this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
    }
    
    private getPedidos(){
      // this.blockUICategories?.start('Loading...');
      this.pedidosService.findAll(this.token)
      .subscribe({
        next: (data: any[]) => {
          this.pedidos.set(data);
          // this.blockUICategories?.stop();
        },
        error: (error) => {
          // this.blockUICategories?.stop();
          this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
        }
      });
    }

    private getClientes(){
      this.clienteService.findAll(this.token)
      .subscribe({
        next: (data) => {
          this.clientes.set(data);
          // this.blockUICategories?.stop();
        },
        error: (error) => {
          // this.blockUICategories?.stop();
          this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
        }
      });
    }

    private getClientesByCedula(){
      // this.blockUICategories?.start('Loading...');
      this.clienteService.findByCedula(this.cedula,this.token)
      .subscribe({
        next: (data) => {
          this.clientes.set(data);
          // this.blockUICategories?.stop();
        },
        error: (error) => {
          // this.blockUICategories?.stop();
          this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
        }
      });
    }

    buscarCliente(dato: string){
      this.clientes.set([]);
      this.cedula = dato;
      this.getClientesByCedula();
      console.log(`dato: ${dato} `);
    }
  
}
