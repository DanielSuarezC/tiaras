import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../shared/models/categorias/services/category.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../environments/environment';
import Swal from 'sweetalert2';
import { create } from 'domain';
import { CreateCategoriaDto } from '../../../../shared/models/categorias/dto/CreateCategoriaDto';
import { Dialog } from '@angular/cdk/dialog';
import { MensajeComponent } from '../../../../shared/components/mensaje/mensaje.component'; 

@Component({
  selector: 'app-addcategory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addcategory.component.html',
  styleUrl: './addcategory.component.css'
})
export class AddcategoryComponent {

  
  private categoryService = inject(CategoryService);
  private cookieService = inject(CookieService);
  private dialog = inject(Dialog);
  private fb = inject(FormBuilder);
  public form1 = this.fb.group({
    nombre: ['', Validators.required]
  })

  private token: string | undefined;

  ngOnInit(){
  }
  
  onSubmit(){
    this.createCategory();
  }
  
  createCategory(){
    this.token = this.cookieService.get(environment.nombreCookieToken);
    if(this.form1.invalid){
      this.form1.markAllAsTouched();
      Swal.fire('Formulario invalido', 'Formulario inválido', 'error');
      // this.blockUI?.stop();
      return;
    }
    const createCategoriaDto = new CreateCategoriaDto();
    createCategoriaDto.nombre = this.form1.get('nombre')?.value ?? undefined;
    this.categoryService.create(createCategoriaDto, this.token)
      .subscribe({
        next: (data) => {
          Swal.fire('Categoría creada', 'Categoría creada con éxito', 'success');
          this.form1.reset();
          // this.blockUI?.stop();
        },
        error: (error) => {
          // this.blockUICategories?.stop();
          // this.dialog.open(MensajeComponent, {data: {titulo: 'Error',
          //   mensaje: 'Error de obtención de datos. ' + error.message, textoBoton: 'Aceptar' }});
          Swal.fire('Error', `Error de obtención de datos.  ${error.message}`, 'error');
        }
      });
    }
  
}
