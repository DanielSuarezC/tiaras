import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

  private fb = inject(FormBuilder);
  public form1: FormGroup = this.fb.group({
    idCliente: [''],
    evento: [''],
    fechaPedido: [''],
    fechaEntrega: [''],
    valorTotal: [''],
    valorPagado: [''],
    valorRestante: [''],
    estadoPago: [''],
    estadoPedido: ['']
  });

  onSubmit(){
    
  }
}
