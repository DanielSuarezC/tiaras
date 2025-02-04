import { Component, EventEmitter, Inject, inject, Output, signal } from '@angular/core';
import { ProductService } from '../../../../shared/models/product/services/product.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../shared/models/categorias/services/category.service';
import { Categoria } from '../../../../shared/models/categorias/entities/Categoria';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../environments/environment';
import Swal from 'sweetalert2';
import { CreateProductoDto } from '../../../../shared/models/product/dto/CreateProductoDto';
import { MensajeService } from '../../../../shared/mensaje/mensaje.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';


@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, BtnComponent],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css'
})
export class CrearProductoComponent {

  // Inyectar servicios
  private categoriaService = inject(CategoryService);
  private productoService = inject(ProductService);
  private mensaje = inject(MensajeService);
  private cookieService = inject(CookieService);
  private fb = inject(FormBuilder);
  // Usar validadores más específicos
  public form1 = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    precio: ['', [Validators.required, Validators.min(1)]],
    imagen: ['', Validators.required],
    idCategoria: [''],
    idInsumo: [''],
    cantidadInsumo: [''],
  });


  //variables
  fileUploaded = false;
  fileName = '';
  selectedFile: File[] = [];
  nombreCategoria = '';
  // Cambiar las signals para usar tipos correctos
  insumosAgregados = signal<{ idInsumo: number, cantidad: number }[]>([]);
  categoriasAgregadas = signal<number[]>([]);
  categorias = signal<Categoria[]>([]);
  private token: string | undefined;

 

  ngOnInit(){
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.getCategoriesByName();
    
  }
  // Actualizar onSubmit
  async onSubmit() {
    if (this.form1.invalid ||
      this.categoriasAgregadas().length === 0 ||
      this.selectedFile.length === 0
    ) {
      this.marcarErrores();
      return;
    }

    const productoData: CreateProductoDto = {
      nombre: this.form1.value.nombre!,
      descripcion: this.form1.value.descripcion!,
      precio: +this.form1.value.precio!,
      categorias: this.categoriasAgregadas(),
      insumos: this.insumosAgregados()
    };

    try {
      this.productoService.crearProducto(
        productoData,
        this.selectedFile,
        this.token!
      ).subscribe({
        next: () => {
          this.mensaje.showMessage('Éxito', 'Producto creado correctamente', 'success');
        },
        error: (error) => {
          this.mostrarError(error);
      }}
    );

      // this.mostrarExito();
      this.resetFormulario();
    } catch (error) {
      this.mostrarError(error);
    }
  }

  onFileSelect(event: Event) {
    // const input = event.target as HTMLInputElement;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.push(input.files[0]);
      // this.selectedFile = input.files[0];
      this.fileName = input.files[0].name;
      this.fileUploaded = true;
      this.form1.get('imagen')?.updateValueAndValidity();
    }
  }

  private marcarErrores() {
    this.form1.markAllAsTouched();
    Swal.fire('Error', 'Verifique los campos requeridos', 'error');
  }

  private resetFormulario() {
    this.form1.reset();
    this.insumosAgregados.set([]);
    this.categoriasAgregadas.set([]);
    this.selectedFile = [];
    this.fileUploaded = false;
  }



  // Modificar método agregarInsumo
  agregarInsumo() {
    const idInsumo = this.form1.get('idInsumo')?.value;
    const cantidad = this.form1.get('cantidadInsumo')?.value;

    if (!idInsumo || !cantidad) {
      Swal.fire('Error', 'Seleccione un insumo e ingrese la cantidad', 'error');
      return;
    }

    this.insumosAgregados.update(insumos => [
      ...insumos,
      { idInsumo: +idInsumo, cantidad: +cantidad }
    ]);

    this.form1.get('idInsumo')?.reset();
    this.form1.get('cantidadInsumo')?.reset();
  }

  // Modificar método agregarCategoria
  agregarCategoria() {
    const idCategoria = this.form1.get('idCategoria')?.value;
    if (!idCategoria) {
      Swal.fire('Error', 'Seleccione una categoría', 'error');
      return;
    }

    this.categoriasAgregadas.update(cats => [...cats, +idCategoria]);
    this.form1.get('idCategoria')?.reset();
  }

  // Obtener nombre de categoría
  getNombreCategoria(idCategoria: number): string {
    return this.categorias().find(c => c.idCategoria === idCategoria)?.nombre || 'Categoría desconocida';
  }

  private getCategories(){
    // this.blockUICategories?.start('Loading...');
    this.categoriaService.findAll(this.token)
    .subscribe({
      next: (data) => {
        this.categorias.set(data);
        // this.blockUICategories?.stop();
      },
      error: (error) => {
        // this.blockUICategories?.stop();
        this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
      }
    });
  }

  private getCategoriesByName(){
    // this.blockUICategories?.start('Loading...');
    this.categoriaService.findByNombre(this.nombreCategoria,this.token)
    .subscribe({
      next: (data) => {
        this.categorias.set(data);
        // this.blockUICategories?.stop();
      },
      error: (error) => {
        // this.blockUICategories?.stop();
        this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
      }
    });
  }

  private mostrarError(error: any) {
    let mensaje = 'Error desconocido';

    if (error.error?.message) {
      mensaje = error.error.message;
    } else if (error.status === 413) {
      mensaje = 'Las imágenes exceden el tamaño máximo permitido';
    } else if (error.status === 415) {
      mensaje = 'Formato de imagen no soportado';
    }

    Swal.fire('Error', mensaje, 'error');
  }

  buscarCategoria(dato: string){
    this.categorias.set([]);
    this.nombreCategoria = dato;
    this.getCategoriesByName();
    console.log(`dato: ${dato} `);
  }
}
