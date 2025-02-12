import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../../shared/models/product/services/product.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class CrearProductoComponent implements OnInit {
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

  /* Variables */
  fileUploaded = false;
  fileName = '';
  selectedFile: File[] = [];
  nombreCategoria = '';
  insumosAgregados = signal<{ idInsumo: number, cantidad: number }[]>([]);
  categoriasAgregadas = signal<Categoria[]>([]);
  categorias = signal<Categoria[]>([]);
  private token: string | undefined;
  size = signal<number>(0);

  constructor() { }
 

  ngOnInit(){
    this.token = this.cookieService.get(environment.nombreCookieToken);
  }

  /* Enviar Formulario */
  async onSubmit() {
    /* if (this.form1.invalid ||
      this.categoriasAgregadas().length === 0 ||
      this.selectedFile.length === 0
    ) {
      this.marcarErrores();
      return;
    } */

    const productoData: CreateProductoDto = {
      nombre: this.form1.value.nombre!,
      descripcion: this.form1.value.descripcion!,
      precio: +this.form1.value.precio!,
      categorias: this.categoriasAgregadas().map(categoria => categoria.id_categoria),
      insumos: this.insumosAgregados()
    };

    console.log({ productoData });

    try {
      this.productoService.crearProducto(
        productoData,
        this.selectedFile,
        this.token!
      ).subscribe({
        next: () => {
          this.mensaje.showMessage('Éxito', 'Producto creado correctamente', 'success');
        }, error: (error) => {
          this.mostrarError(error);
        }
      });

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
  agregarCategoria(categoria: Categoria) {
    this.categoriasAgregadas.update(cats => [...cats, categoria]);
    console.log(this.categoriasAgregadas());
  }

  /* Verificar si una categoria existe en el arreglo de Categorias */
  existCategoria(categoria: Categoria): boolean {
    return this.categoriasAgregadas().includes(categoria);
  }

  // Obtener nombre de categoría
  getNombreCategoria(idCategoria: number | undefined): string {
    if (!idCategoria) {
      return 'Categoría desconocida';
    }
    this.categoriaService.findOne(idCategoria, this.token).subscribe({
      next: (data) => {
        console.log(data);
        return data.nombre || 'Categoría desconocida';
      },
      error: (error) => {
        console.log(error);
        return 'Categoría desconocida';
      }
    });
    return 'Categoría desconocida';
  }

  private getCategories(){
    this.categoriaService.findAll(this.token)
    .subscribe({
      next: (data) => {
        this.categorias.set(data);
      },
      error: (error) => {
        this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
      }
    });
  }

  private getCategoriesByName(){
    this.categoriaService.findByNombre(this.nombreCategoria,this.token)
    .subscribe({
      next: (data: Categoria[]) => {
        console.log('data',data);
        this.categorias.set(data);
        console.log('categorias',this.categorias());

        if (this.categorias().length > 0) {
          this.form1.patchValue({
            idCategoria: this.categorias()[0].id_categoria?.toString()
          });
        }
      },
      error: (error) => {
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

  buscarCategoria(dato: string) {
    if (dato.trim().length > 0) {
      this.form1.get('idCategoria')?.setValue('');
      this.categorias.set([]);
      this.nombreCategoria = dato;
      this.getCategoriesByName();
      this.size.set(this.categorias().length);
      
      if (this.categorias().length > 0 && this.categorias().length <= 5) {
        const selectElement = document.getElementById('categoria') as HTMLSelectElement;
      
        if (selectElement) {
          selectElement.size = this.categorias().length;
        }
      }
    } else {
      this.categorias.set([]);
    }
  }

  hasErrors(controlName: string, errorType: string) {
    return this.form1.get(controlName)?.hasError(errorType) && this.form1.get(controlName)?.touched;
  }
}
