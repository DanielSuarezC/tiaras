import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styles: ''
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
