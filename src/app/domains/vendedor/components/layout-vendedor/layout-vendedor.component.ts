import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-layout-vendedor',
  standalone: true,
  imports: [CommonModule,HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './layout-vendedor.component.html',
  styleUrl: './layout-vendedor.component.css'
})
export class LayoutVendedorComponent {

}
