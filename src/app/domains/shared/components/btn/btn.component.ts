import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.css'
})
export class BtnComponent {

    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() color: string = 'peach';

  //los colores disponibles son en base a la paleta de colores de la marca:
  // 'tiaras': {
  //         cream: "#FBF6E4",
  //         peach: "#F0CD98",
  //         beige: "#C69D75",
  //         wine: "#490D0B",
  //       },
  get colors(){
    return {
      ' text-pallete-900 bg-primary-600 hover:bg-primary-700': this.color === 'peach',
      ' focus:ring-primary-300 ': this.color === 'peach',
      ' dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800': this.color ==='peach',
      ' text-white bg-tiaras-wine hover:bg-primary-700': this.color === 'wine',
      ' focus:ring-tiaras-wine ': this.color === 'wine',
      ' dark:bg-tiaras-wine dark:hover:bg-primary-700 dark:focus:ring-primary-800': this.color ==='wine',
    };
  }
}
