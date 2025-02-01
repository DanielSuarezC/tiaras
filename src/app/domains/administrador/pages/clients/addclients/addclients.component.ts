import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Country } from '../../../../shared/models/paises/paises.interface';
import { PaisesService } from '../../../../shared/models/paises/paises.service';

@Component({
  selector: 'app-addclients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addclients.component.html',
  styleUrl: './addclients.component.css'
})
export class AddclientsComponent {
  private fb = inject(FormBuilder);
  public form1 = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', Validators.required],
    telefono: ['', Validators.required],
    pais: ['', Validators.required],
    ciudad: ['', Validators.required],
  });

  ngOnInit(){

  }

  onSubmit(){
    console.log(this.form1.value);
  }


}
