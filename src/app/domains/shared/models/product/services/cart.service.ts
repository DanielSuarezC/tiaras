import { computed, inject, Injectable, signal } from '@angular/core';
import { CreateItemDto } from '../../pedidos/dto/CreateItemDto';
import { Producto } from '../entities/Producto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private shipment = 18000;
  private storageKeyCart = 'cart';
  private storageKeyItemDto = 'createItemDto';

  baseUrl = environment.urlServices;
  http = inject(HttpClient);

  cart = signal<Producto[]>(this.loadCart());
  createItemDto = signal<CreateItemDto[]>(this.loadCreateItemDto());

  subTotal = computed(() => {
    return this.cart().reduce((acumulado, product) => {
      const cantidad = this.createItemDto().find(item => item.idProducto === product.idProducto)?.cantidad || 1;
      return acumulado + ((product?.precio || 0) * cantidad);
    }, 0);
  });

  total = computed(() => this.subTotal() ? this.subTotal() + this.shipment : 0);

  constructor() {}

  private loadCart(): Producto[] {
    return JSON.parse(localStorage.getItem(this.storageKeyCart) || '[]');
  }

  private loadCreateItemDto(): CreateItemDto[] {
    return JSON.parse(localStorage.getItem(this.storageKeyItemDto) || '[]');
  }

  private saveCart() {
    localStorage.setItem(this.storageKeyCart, JSON.stringify(this.cart()));
    localStorage.setItem(this.storageKeyItemDto, JSON.stringify(this.createItemDto()));
  }

  addTocart(product: Producto | undefined, cantidad: number = 1) {
    if (product) {
      this.cart.update(prevState => [...prevState, product]);
      this.createItemDto.update(prevState => [...prevState, { idProducto: product.idProducto, cantidad }]);
      this.saveCart();
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
    this.createItemDto.update(prevState => prevState.filter(item => item.idProducto !== productId));
    this.saveCart();
  }

  incrementQuantity(idProducto: number | undefined) {
    if (idProducto !== undefined) {
      this.createItemDto.update(prevState =>
        prevState.map(item => item.idProducto === idProducto ? { ...item, cantidad: (item.cantidad || 0) + 1 } : item)
      );
      this.saveCart();
    }
  }

  decrementQuantity(idProducto: number | undefined) {
    if (idProducto !== undefined) {
      this.createItemDto.update(prevState =>
        prevState.map(item => item.idProducto === idProducto ? { ...item, cantidad: Math.max((item.cantidad || 1) - 1, 1) } : item)
      );
      this.saveCart();
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
    localStorage.removeItem(this.storageKeyCart);
    localStorage.removeItem(this.storageKeyItemDto);
  }
}
