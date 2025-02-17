import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footerVendedor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footerVendedor.component.html',
  styleUrls: ['./footerVendedor.component.css']
})
export class FooterVendedorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
