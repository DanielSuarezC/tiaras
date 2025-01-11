import { CommonModule } from '@angular/common';
import { Component, Input, Output, output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Product } from '../../../shared/models/Product';
import { TimeAgoPipePipe } from '../../../shared/pipes/time-ago-pipe.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, TimeAgoPipePipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  @Input({required: true}) product!: Product;

  @Output() addToCart = new EventEmitter();

  addToCardHandler(){
    console.log('Add to cart');
    this.addToCart.emit(this.product);
  }

}
