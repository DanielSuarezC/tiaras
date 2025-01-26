import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../Product';
import { ProductComponent } from '../../../../vendedor/components/product/product.component';
import { CreateItemDto } from '../../pedidos/dto/CreateItemDto';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cart = signal<Product[]>([]);
  createItemDto = signal<CreateItemDto[]>([]);
  private shipment = 18000;

  subTotal = computed(() => {
    const cart = this.cart();
    const createItemDto = this.createItemDto();
    return cart.reduce((acumulado, product) => {
      const cantidad = createItemDto.find(item => item.idProducto === product.id)?.cantidad || 1;
      return acumulado + ((product?.price || 0) * cantidad);
    }, 0);
  });

  
  total = computed(() => {
    if(this.subTotal() != 0){
      return this.subTotal() + this.shipment;
    }
    return 0;
  });


  constructor() { }

  addTocart(product: Product | undefined, cantidad: number = 1){
    if (product) {
      this.cart.update(prevState => [...prevState, product]);
      this.createItemDto.update(prevState => [...prevState, {idProducto: product.id, cantidad: cantidad}]);
    }
  }

  cantidadEspecifica(idProducto: number | undefined){
    return this.createItemDto().find(item => item.idProducto === idProducto)?.cantidad;
  }
  productExists(id: number | undefined){
    return this.cart().some(cartItem => cartItem.id === id);
  }

  removeItem(productId: number | undefined) {
    this.cart.update(prevState => prevState.filter(product => product.id !== productId));
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

  getShipment(){
    return this.shipment;
  }

  setShipment(shipment: number){
    this.shipment = shipment;
  }
}
