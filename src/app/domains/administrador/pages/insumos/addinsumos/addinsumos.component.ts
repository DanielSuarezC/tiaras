import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsumosService } from '../../../../shared/models/insumos/services/insumos.service';
import { CookieService } from 'ngx-cookie-service';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { environment } from '../../../../../../environments/environment';
import Swal from 'sweetalert2';
import { CreateInsumoDto } from '../../../../shared/models/insumos/dto/CreateInsumoDto';
import { MensajeComponent } from '../../../../shared/components/mensaje/mensaje.component'; 
import { Validator } from 'class-validator';
import { MensajeService } from '../../../../shared/mensaje/mensaje.service';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';

@Component({
  selector: 'app-addinsumos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, BtnComponent],
  templateUrl: './addinsumos.component.html',
  styleUrl: './addinsumos.component.css'
})
export class AddinsumosComponent {


  private insumoService = inject(InsumosService);
  private cookieService = inject(CookieService);
  private mensaje = inject(MensajeService);
  private dialog = inject(Dialog);
  private fb = inject(FormBuilder);
  public form1 = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    tipo: ['', Validators.required],
    unidadMedida: ['', Validators.required],
    imagen: ['', Validators.required]
  });
  fileUploaded = false;
  fileName = '';
  selectedFile: File | null = null;

  private token: string | undefined;

  ngOnInit() {
    this.token = this.cookieService.get(environment.nombreCookieToken);
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
      this.fileUploaded = true;
      this.form1.get('imagen')?.updateValueAndValidity();
    }
  }
  onSubmit() {
    if (this.form1.invalid || !this.selectedFile) {
      Swal.fire('Formulario invalido', 'Formulario inválido', 'error');
      return;
    }
    
    const formData = new FormData();
    formData.append('insumo', JSON.stringify(this.form1.value));
    formData.append('imagen', this.selectedFile);
    this.insumoService.crear(formData, this.token).subscribe(
      response => {
        // console.log('Insumo creado:', response);
        this.mensaje.showMessage('Insumo creado', 'Insumo creado con éxito', 'success');
        this.form1.reset();
        this.selectedFile = null;
      },
      error => {
        this.mensaje.showMessage('Error', `Error al crear insumo: ${error.message}`, 'error');
      }
      );
  }

  
}
