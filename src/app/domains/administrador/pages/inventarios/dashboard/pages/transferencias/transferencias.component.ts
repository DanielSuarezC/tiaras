import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DefaultPaginationValue, Pagination } from '../../../../../../shared/models/paginated.interface';
import { InputComponent } from '../../../../../../shared/components/input/input.component';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Dropdown } from 'flowbite';
import { TransferenciaInsumos } from '../../../../../../shared/models/transferencias/entities/transferencia-insumos.entity';
import { TransferenciasService } from '../../../../../../shared/models/transferencias/services/transferencias.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-transferencias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, PaginationComponent],
  templateUrl: './transferencias.component.html',
  styles: ``
})
export class TransferenciasComponent {
  @Input()
  public idInventario: number;

  public pagination: Pagination<TransferenciaInsumos> = DefaultPaginationValue;

  /* ButtonModal */
  @ViewChild('buttonModal', { read: ElementRef })
  public buttonModal: ElementRef<HTMLButtonElement>;

  /* Modal */
  @ViewChild('formModal', { read: ElementRef })
  public modal: ElementRef<HTMLDivElement>;

  /* Buttons of Dropdowns Menus */
  @ViewChildren('dropdownButton', { read: ElementRef })
  public buttons: QueryList<ElementRef<HTMLButtonElement>>;

  /* Dropdowns Menus */
  @ViewChildren('dropdownMenu', { read: ElementRef })
  public dropdownsMenu: QueryList<ElementRef<HTMLDivElement>>;

  /* Dropdowns */
  private dropdowns: Dropdown[] = [];

  public token: string;
  public page: number = 1;
  public searchTerm: string = '';
  public sortBy: string = 'fecha:DESC';

  constructor(
    private transferenciasService: TransferenciasService,
    private cookieService: CookieService,
    private route: ActivatedRoute
  ) {}

  /* NgOnInit */
  ngOnInit(): void {
    this.getIdInventario();
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.transferenciasService.findAllTI(this.token, this.idInventario, this.page).subscribe((res) => {
      this.pagination = res;

      setTimeout(() => this.inicializarDropdowns());
    });
  }

  /* Obtener IdInventario (Params) */
  private getIdInventario(): void {
    this.route.parent.paramMap.subscribe((params) => {
      this.idInventario = Number(params.get('idInventario'));
      console.log(this.idInventario);
    });
  }
  
  /* Inicializar Dropdowns */
  private inicializarDropdowns(): void {
    if (this.buttons.length > 0 && this.dropdownsMenu.length > 0) {
      this.dropdowns = [];

      this.buttons.forEach((button, index) => {
        const menu = this.dropdownsMenu.get(index);
        if (menu) {
          const dropdown = new Dropdown(menu.nativeElement, button.nativeElement);
          this.dropdowns.push(dropdown);
        }
      });
    }
  }

  /* Páginas */
  generateNumbers(): number[] {
    const numbers: number[] = [];
    for (let i = 1; i <= this.pagination?.meta.totalPages; i++) {
      numbers.push(i);
    }

    return numbers;
  }

  /* Cambiar Página */
  public cambiarPagina(page: number): void {
    this.page = page;
    this.transferenciasService.findAllTI(this.token, this.idInventario, this.page).subscribe((res) => {
      this.pagination = res;

      setTimeout(() => this.inicializarDropdowns());
    });
  }
}
