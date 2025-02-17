import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
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
import { pipe, tap } from 'rxjs';


@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, BtnComponent],
  templateUrl: './crear-producto.component.html',
  styles: ''
})
export class CrearProductoComponent implements OnInit {
  /* Attributes */
  @Input()
  public idProducto: number | undefined;

  public fileUploaded: boolean = false;
  public fileName: string = '';
  public selectedFile: File[] = [];
  public nombreCategoria: string = '';
  public insumosAgregados: WritableSignal<{ idInsumo: number, cantidad: number }[]> = signal<{ idInsumo: number, cantidad: number }[]>([]);
  public categoriasAgregadas: WritableSignal<Categoria[]> = signal<Categoria[]>([]);
  public categorias: WritableSignal<Categoria[]> = signal<Categoria[]>([]);
  private token: string | undefined;
  public size: WritableSignal<number> = signal<number>(0);

  /* Constructor */
  constructor(
    private categoriaService: CategoryService,
    private productoService: ProductService,
    private mensaje: MensajeService,
    private cookieService: CookieService,
    private fb: FormBuilder
  ) { }

  /* Formulario de Creación de Productos */
  public createProductoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(250)]],
    precio: ['', [Validators.required, Validators.min(1)]],
    imagen1: ['', Validators.required],
    imagen2: ['', Validators.required],
    idCategoria: [''],
    idInsumo: [''],
    cantidadInsumo: [''],
  });

  /* Variables */
  fileUploaded1 = false;
  fileUploaded2 = false;
  fileName1 = '';
  fileName2 = '';
  selectedFile2: File[] = [];

  ngOnInit(){
    this.token = this.cookieService.get(environment.nombreCookieToken);
    
    if (this.idProducto) {
      this.productoService.findOne(this.idProducto.toString(), this.token).subscribe({
        next: (data) => {
          console.log(data);
          this.createProductoForm.patchValue({
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio.toString()
          });

          this.categoriasAgregadas.set([...data.categorias]);
        },
        error: (error) => {
          this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
        }
      });
    }
  }

  /* Enviar Formulario */
  async onSubmit() {
    if (this.createProductoForm.invalid ||
      this.categoriasAgregadas().length === 0 ||
      this.selectedFile.length === 0
    ) {
      this.marcarErrores();
      return;
    }

    switch (this.idProducto) {
      case undefined:
        this.crearProducto();
        break;
      default:
        this.editarProducto();
        break;
    }
  }

  /* Crear Producto */
  private crearProducto() {
    const productoData: CreateProductoDto = {
      nombre: this.createProductoForm.value.nombre!,
      descripcion: this.createProductoForm.value.descripcion!,
      precio: +this.createProductoForm.value.precio!,
      categorias: this.categoriasAgregadas().map(categoria => categoria.idCategoria),
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
        }, error: (error) => {
          this.mostrarError(error);
        }
      });

      this.resetFormulario();
    } catch (error) {
      this.mostrarError(error);
    }
  }

  /* Modificar Producto */
  private editarProducto() {
    const productoData: CreateProductoDto = {
      nombre: this.createProductoForm.value.nombre!,
      descripcion: this.createProductoForm.value.descripcion!,
      precio: this.createProductoForm.value.precio!,
      categorias: this.categoriasAgregadas().map(categoria => categoria.idCategoria),
    };

    console.log(productoData);

    try {
      this.productoService.editarProducto(
        this.idProducto.toString(),
        productoData,
        this.selectedFile,
        this.token!
      ).subscribe({
        next: () => {
          this.mensaje.showMessage('Éxito', 'Producto modificado correctamente', 'success');
        }, error: (error) => {
          this.mostrarError(error);
        }
      });

      this.resetFormulario();
    } catch (error) {
      this.mostrarError(error);
    }
  }

  /* Modificar Producto */
  private editarProducto() {
    const productoData: CreateProductoDto = {
      nombre: this.createProductoForm.value.nombre!,
      descripcion: this.createProductoForm.value.descripcion!,
      precio: this.createProductoForm.value.precio!,
      categorias: this.categoriasAgregadas().map(categoria => categoria.idCategoria),
    };

    console.log(productoData);

    try {
      this.productoService.editarProducto(
        this.idProducto.toString(),
        productoData,
        this.selectedFile,
        this.token!
      ).subscribe({
        next: () => {
          this.mensaje.showMessage('Éxito', 'Producto modificado correctamente', 'success');
        }, error: (error) => {
          this.mostrarError(error);
        }
      });

      this.resetFormulario();
    } catch (error) {
      this.mostrarError(error);
    }
  }

  onFileSelect(event: Event, index: number) {
    // const input = event.target as HTMLInputElement;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.push(input.files[0]);
      // this.selectedFile.push(input.files[0]);
      // this.selectedFile2.push(input.files[0]);
      // this.selectedFile = input.files[0];
      if(index === 1){
        this.fileName1 = input.files[0].name;
        this.fileUploaded1 = true;
      }else if(index === 2){
        this.fileName2 = input.files[0].name;
        this.fileUploaded2 = true;
      }
      this.createProductoForm.get('imagen1')?.updateValueAndValidity();
      this.createProductoForm.get('imagen2')?.updateValueAndValidity();
      console.log(this.selectedFile); 
    }
  }

  private marcarErrores() {
    this.createProductoForm.markAllAsTouched();
    Swal.fire('Error', 'Verifique los campos requeridos', 'error');
  }

  private resetFormulario() {
    this.createProductoForm.reset();
    this.insumosAgregados.set([]);
    this.categoriasAgregadas.set([]);
    this.selectedFile = [];
    this.fileUploaded1 = false;
    this.fileUploaded2 = false;
  }

  // Modificar método agregarInsumo
  agregarInsumo() {
    const idInsumo = this.createProductoForm.get('idInsumo')?.value;
    const cantidad = this.createProductoForm.get('cantidadInsumo')?.value;

    if (!idInsumo || !cantidad) {
      Swal.fire('Error', 'Seleccione un insumo e ingrese la cantidad', 'error');
      return;
    }

    this.insumosAgregados.update(insumos => [
      ...insumos,
      { idInsumo: +idInsumo, cantidad: +cantidad }
    ]);

    this.createProductoForm.get('idInsumo')?.reset();
    this.createProductoForm.get('cantidadInsumo')?.reset();
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

  private getCategoriesByName(){
    this.categoriaService.findByNombre(this.nombreCategoria, this.token)
      .subscribe({
        next: (data: Categoria[]) => {
          const categoriasFiltradas = data.filter(cat => !this.categoriasAgregadas().some(catAgregada => catAgregada.idCategoria === cat.idCategoria));
          this.categorias.set(categoriasFiltradas);

          if (this.categorias().length > 0) {
            this.createProductoForm.patchValue({
              idCategoria: this.categorias()[0].idCategoria?.toString()
            });
          }
        },
        error: (error) => {
          this.mensaje.showMessage('Error', `Error de obtención de datos.  ${error.message}`, 'error');
        }
      });
        if (this.categorias().length > 0) {
          this.createProductoForm.patchValue({
            idCategoria: this.categorias()[0].idCategoria?.toString()
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
      this.createProductoForm.get('idCategoria')?.setValue('');
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

  eliminarCategoria(categoria: Categoria) {
    this.categoriasAgregadas.update(cats => cats.filter(cat => cat.idCategoria !== categoria.idCategoria));
  }
}
