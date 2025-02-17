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
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { MensajeService } from '../../../../shared/mensaje/mensaje.service';

@Component({
  selector: 'app-addcategory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,BtnComponent],
  templateUrl: './addcategory.component.html',
  styleUrl: './addcategory.component.css'
})
export class AddcategoryComponent {


  private categoryService = inject(CategoryService);
  private cookieService = inject(CookieService);
  private mensaje = inject(MensajeService);
  private fb = inject(FormBuilder);
  public form1 = this.fb.group({
    nombre: ['', Validators.required]
  })

  private token: string | undefined;

  ngOnInit() {
  }

  onSubmit() {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    if (this.form1.invalid) {
      this.form1.markAllAsTouched();
      this.mensaje.showMessage('Formulario inválido', 'Formulario inválido','error');
      // this.blockUI?.stop();
      return;
    }
    const createCategoriaDto = new CreateCategoriaDto();
    createCategoriaDto.nombre = this.form1.get('nombre')?.value ?? undefined;
    this.categoryService.create(createCategoriaDto, this.token)
      .subscribe({
        next: (data) => {
          this.mensaje.showMessage('Categoría creada', `Categoría ${createCategoriaDto.nombre} creada con éxito`,'success');
          this.form1.reset();
          // this.blockUI?.stop();
        },
        error: (error) => {
          Swal.fire('Error', `Error de obtención de datos.  ${error.message}`, 'error');
        }
      });
  }


}
