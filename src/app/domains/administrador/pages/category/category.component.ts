import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {OverlayModule} from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule,OverlayModule,RouterModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
 isOpenActions = false;
  isOpenFilters = false;
  isOpenDropdown = false;
  isOpenDropdown1 = false;
  mobileMenu = signal(true);

  toogleMenu(){
    this.mobileMenu.update(prevState => !prevState);
  }
  // Método para cerrar el dropdown
  closeDropdown() {
    this.isOpenDropdown = false;
  }
// Método para alternar el estado del menú
toggleDropdown(event: Event): void {
  this.isOpenDropdown = !this.isOpenDropdown;
  event.stopPropagation(); // Evita que el clic se propague al documento.
}
}