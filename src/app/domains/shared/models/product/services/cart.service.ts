import { computed, inject, Injectable, signal } from '@angular/core';
import { CreateItemDto } from '../../pedidos/dto/CreateItemDto';
import { Producto } from '../entities/Producto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cart = signal<Producto[]>([]);
  createItemDto = signal<CreateItemDto[]>([]);
  private shipment = 18000;

  baseUrl = environment.urlServices;
  http = inject(HttpClient);

  subTotal = computed(() => {
    const cart = this.cart();
    const createItemDto = this.createItemDto();
    return cart.reduce((acumulado, product) => {
      const cantidad = createItemDto.find(item => item.idProducto === product.idProducto)?.cantidad || 1;
      return acumulado + ((product?.precio || 0) * cantidad);
    }, 0);
  });


  total = computed(() => {
    if (this.subTotal() != 0) {
      return this.subTotal() + this.shipment;
    }
    return 0;
  });


  constructor() {}

  addTocart(product: Producto | undefined, cantidad: number = 1){
    if (product) {
      this.cart.update(prevState => [...prevState, product]);
      this.createItemDto.update(prevState => [...prevState, {idProducto: product.idProducto, cantidad: cantidad}]);
    }
  }

  cantidadEspecifica(idProducto: number | undefined) {
    return this.createItemDto().find(item => item.idProducto === idProducto)?.cantidad;
  }
  productExists(id: number | undefined) {
    return this.cart().some(cartItem => cartItem.idProducto === id);
  }

  removeItem(productId: number | undefined) {
    this.cart.update(prevState => prevState.filter(product => product.idProducto !== productId));
  }

  incrementQuantity(idProducto: number | undefined) {
    if (idProducto !== undefined) {
      this.createItemDto.update(prevState =>
        prevState.map(item =>
          item.idProducto === idProducto ? { ...item, cantidad: (item.cantidad || 0) + 1 } : item
        )
      );
    }
  }

  decrementQuantity(idProducto: number | undefined) {
    if (idProducto !== undefined) {
      this.createItemDto.update(prevState =>
        prevState.map(item =>
          item.idProducto === idProducto ? { ...item, cantidad: (item.cantidad || 0) - 1 } : item
        )
      );
    }
  }

  getShipment() {
    return this.shipment;
  }

  setShipment(shipment: number) {
    this.shipment = shipment;
  }

  clearCart() {
    this.cart.update(() => []);
    this.createItemDto.update(() => []);
  }
}
