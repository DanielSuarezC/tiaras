import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {OverlayModule} from '@angular/cdk/overlay';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaisesService } from '../../../../shared/models/paises/paises.service';
import { Country}  from '../../../../shared/models/paises/paises.interface';
@Component({
  selector: 'app-addproducts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addproducts.component.html',
  styleUrl: './addproducts.component.css'
})
export class AddproductsComponent {
  private fb = inject(FormBuilder);
  public form1 = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: ['', Validators.required],
    categoria: ['', Validators.required],
    idInsumo: ['', Validators.required],
    cantidadInsumo: ['', Validators.required],
    imagen: ['', Validators.required],
  });
  fileUploaded = false;
  fileName = '';

  onSubmit(){
    console.log(this.form1.value);
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.fileUploaded = true;
    }
  }
}
