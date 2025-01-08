import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-vendedor',
  standalone: true,
  imports: [CommonModule,HeaderComponent, RouterOutlet],
  templateUrl: './layout-vendedor.component.html',
  styleUrl: './layout-vendedor.component.css'
})
export class LayoutVendedorComponent {

}
