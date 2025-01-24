import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductComponent } from '../../../vendedor/components/product/product.component';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cart = signal<Product[]>([]);
  private shipment = 18000;

  subTotal = computed(() => {
    const cart = this.cart();
    return cart.reduce((acc, product) => acc + (product?.price || 0), 0);
  });

  
  total = computed(() => {
    if(this.subTotal() != 0){
      return this.subTotal() + this.shipment;
    }
    return 0;
  });


  constructor() { }

  addTocart(product: Product | undefined){
    if (product) {
      this.cart.update(prevState => [...prevState, product]);
    }
  }

  productExists(id: number | undefined){
    return this.cart().some(cartItem => cartItem.id === id);
  }

  removeItem(productId: number | undefined) {
    this.cart.update(prevState => prevState.filter(product => product.id !== productId));
  }

  getShipment(){
    return this.shipment;
  }

  setShipment(shipment: number){
    this.shipment = shipment;
  }
}
