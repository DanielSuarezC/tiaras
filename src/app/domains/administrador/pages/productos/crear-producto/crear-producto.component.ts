import { Component, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
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
import { Insumo } from '../../../../shared/models/insumos/entities/Insumo';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { InsumosService } from '../../../../shared/models/insumos/services/insumos.service';
import { Pagination } from '../../../../shared/models/paginated.interface';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, BtnComponent],
  templateUrl: './crear-producto.component.html',
  styles: ''
})
export class CrearProductoComponent implements OnInit, OnDestroy {
  /* Attributes */
  @Input()
  public idProducto: number | undefined;

  public fileUploaded: boolean = false;
  public fileName: string = '';
  public selectedFile: File[] = [];
  public nombreCategoria: string = '';
  public categoriasAgregadas: WritableSignal<Categoria[]> = signal<Categoria[]>([]);
  public categorias: WritableSignal<Categoria[]> = signal<Categoria[]>([]);
  private token: string | undefined;
  public size: WritableSignal<number> = signal<number>(0);

  public insumosSeleccionados: { insumo: Insumo, cantidad: number }[] = [];
  public insumosSearch: Insumo[] = [];
  public insumoSeleccionado: Insumo;
  public searchTerm: string = '';
  public mostrarDropdown = false;

  /* Debouncer */
  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSubscription?: Subscription;

  /* Constructor */
  constructor(
    private categoriaService: CategoryService,
    private productoService: ProductService,
    private mensaje: MensajeService,
    private cookieService: CookieService,
    private insumosService: InsumosService,
    private fb: FormBuilder
  ) { }

  /* Formulario de Creación de Productos */
  public createProductoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
    precio: ['', [Validators.required, Validators.min(1)]],
    imagen1: ['', Validators.required],
    imagen2: ['', Validators.required],
    idCategoria: [''],
    idInsumo: [''],
    cantidadInsumo: [''],
    insumoSearch: [''],
    insumoStock: ['', [Validators.min(1)]]
  });

  /* Variables */
  fileUploaded1 = false;
  fileUploaded2 = false;
  fileName1 = '';
  fileName2 = '';
  selectedFile2: File[] = [];

  ngOnInit() {
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

    this.debouncerSubscription = this.debouncer
      .pipe(debounceTime(500))
      .subscribe((value: string) => this.onInsumoSearch(value));
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
      insumos: this.insumosSeleccionados.map(i => ({ idInsumo: i.insumo.idInsumo, cantidad: i.cantidad }))
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
      precio: +this.createProductoForm.value.precio!,
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
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.push(input.files[0]);
      if (index === 1) {
        this.fileName1 = input.files[0].name;
        this.fileUploaded1 = true;
      } else if (index === 2) {
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
    this.insumosSeleccionados = [];
    this.categoriasAgregadas.set([]);
    this.selectedFile = [];
    this.fileUploaded1 = false;
    this.fileUploaded2 = false;
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

  private getCategoriesByName() {
    this.categoriaService.findByNombre(this.nombreCategoria, this.token).subscribe({
      next: (data: Categoria[]) => {
        const categoriasFiltradas = data.filter(cat => !this.categoriasAgregadas().some(catAgregada => catAgregada.idCategoria === cat.idCategoria));
        this.categorias.set(categoriasFiltradas);

        if (this.categorias().length > 0) {
          this.createProductoForm.patchValue({
            idCategoria: this.categorias()[0].idCategoria?.toString()
          });
        }
      }, error: (error) => {
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
    return this.createProductoForm.get(controlName)?.hasError(errorType) && this.createProductoForm.get(controlName)?.touched;
  }

  eliminarCategoria(categoria: Categoria) {
    this.categoriasAgregadas.update(cats => cats.filter(cat => cat.idCategoria !== categoria.idCategoria));
  }

  ngOnDestroy(): void {
    this.debouncerSubscription.unsubscribe();
  }

  onInsumoSearch(searchTerm: string) {
    if (searchTerm && searchTerm.trim().length > 0) {
      this.insumosService.findAll(this.token, 1, this.searchTerm).subscribe({
        next: (data: Pagination<Insumo>) => {
          this.insumosSearch = data.data;
        },
        error: (error) => this.mensaje.showMessage('Error', `Error de obtención de datos. ${error.error.message}`, 'error')
      });
    } else {
      this.insumosSearch = [];
    }
  }

  ocultarDropdownConRetraso() {
    setTimeout(() => {
      this.mostrarDropdown = false;
    }, 200);
  }

  selectInsumo(insumo: Insumo) {
    this.createProductoForm.get('insumoSearch')?.setValue(insumo.nombre);
    this.insumoSeleccionado = insumo;
    this.insumosSearch = [];
  }

  addInsumo() {
    const stock = Number(this.createProductoForm.get('insumoStock')?.value);
    if (!stock) {
      this.mensaje.showMessage('Error', 'Ingrese la cantidad del producto', 'error');
      return;
    }

    /* Validar si el Insumo ya fue seleccionado */
    if (this.insumosSeleccionados.find(i => i.insumo.idInsumo === this.insumoSeleccionado.idInsumo)) {
      this.insumosSeleccionados = this.insumosSeleccionados.map(i => {
        if (i.insumo.idInsumo === this.insumoSeleccionado.idInsumo) {
          i.cantidad = stock;
        }
        return i;
      });

      this.createProductoForm.get('insumoSearch')?.reset();
      this.createProductoForm.get('insumoStock')?.reset();

      return;
    }

    this.insumosSeleccionados = [...this.insumosSeleccionados, { insumo: this.insumoSeleccionado, cantidad: +stock }];

    console.log(this.insumosSeleccionados);

    this.createProductoForm.get('insumoSearch')?.reset();
    this.createProductoForm.get('insumoStock')?.reset();
  }

  editInsumo(insumo: Insumo) {
    const insumoSeleccionado = this.insumosSeleccionados.find(i => i.insumo.idInsumo === insumo.idInsumo);
    if (!insumoSeleccionado) {
      this.mensaje.showMessage('Error', 'Error al editar el insumo', 'error');
      return;
    }

    this.createProductoForm.get('insumoSearch')?.setValue(insumo.nombre);
    this.createProductoForm.get('insumoStock')?.setValue(insumoSeleccionado.cantidad.toString());
    this.insumoSeleccionado = insumo;
  }

  removeInsumo(insumo: Insumo) {
    this.insumosSeleccionados = this.insumosSeleccionados.filter(i => i.insumo.idInsumo !== insumo.idInsumo);
  }

  onKeyPress(dato: string){
    this.debouncer.next(dato);
    this.searchTerm = dato;
  }
}
