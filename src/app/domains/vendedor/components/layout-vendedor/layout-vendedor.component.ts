import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterVendedorComponent } from '../footerVendedor/footerVendedor.component';

@Component({
  selector: 'app-layout-vendedor',
  standalone: true,
  imports: [CommonModule,HeaderComponent, RouterOutlet, FooterVendedorComponent],
  templateUrl: './layout-vendedor.component.html',
  styleUrl: './layout-vendedor.component.css'
})
export class LayoutVendedorComponent {

}
