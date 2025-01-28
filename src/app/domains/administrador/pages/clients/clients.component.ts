import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {OverlayModule} from '@angular/cdk/overlay';



import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule,OverlayModule,RouterModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
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
