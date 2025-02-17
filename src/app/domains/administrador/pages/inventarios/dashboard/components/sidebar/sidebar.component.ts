import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'inventarios-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class InventarioSidebarComponent {
   @Input()
   public idInventario: number;

   @Input()
    public inventarioName: string;
}
