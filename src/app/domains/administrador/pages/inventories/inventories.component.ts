import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventories.component.html',
  styleUrl: './inventories.component.css'
})
export class InventoriesComponent {

  mobileMenu = signal(true);

  toogleMenu(){
    this.mobileMenu.update(prevState => !prevState);
  }

}
