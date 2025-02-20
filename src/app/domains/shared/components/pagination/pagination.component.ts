import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Meta } from '../../models/paginated.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styles: ``
})
export class PaginationComponent {
  @Input()
  public meta: Meta;

  @Input()
  public currentPage: number = 1;

  @Output()
  public page: EventEmitter<number> = new EventEmitter<number>();

  /* Cambiar Página */
  public cambiarPagina(page: number): void {
    this.page.emit(page);
  }

  /* Generar Números */
  public generarNumeros(): number[] {
    const numbers: number[] = [];
    for (let i = 1; i <= this.meta.totalPages; i++) {
      numbers.push(i);
    }
    return numbers;
  }
}
