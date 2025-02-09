import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../../Product';
import { ProductComponent } from '../../../../vendedor/components/product/product.component';
import { CreateItemDto } from '../../pedidos/dto/CreateItemDto';
import Swal from 'sweetalert2';
import { Producto } from '../entities/Producto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // cart = signal<Product[]>([]);
  cart = signal<Producto[]>([]);
  createItemDto = signal<CreateItemDto[]>([]);
  private shipment = 18000;
  // imagenBase64: string = 'data:image/jpeg;base64,/';
  imagenBase64: string = '';
  // imagenBase64 = signal<string[]>([]);

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


  constructor() {
    this.getImagenBase64();

  }

  addTocart(product: Producto | undefined, cantidad: number = 1){
    if (product) {
      this.cart.update(prevState => [...prevState, product]);
      this.createItemDto.update(prevState => [...prevState, {idProducto: product.idProducto, cantidad: cantidad}]);
    }
  }

  // async addTocart(product: Producto | undefined, cantidad: number = 1) {
  //   if (product) {
  //     let convert = '';
  //     if (product.imagenes && product.imagenes.length > 0) {
  //       try {
  //         const imageUrl = `${this.baseUrl}uploads/${product.imagenes[0]}`;
  //         const base64Image = this.encodeToBase64(imageUrl);
  //         convert = 'data:image/jpeg;base64,/' + base64Image; // Sobrescribe la URL con Base64
  //       } catch (error) {
  //         console.error('Error al convertir la imagen a Base64', error);
  //       }
  //     }

  //     this.cart.update(prevState => [...prevState, product]);
  //     this.createItemDto.update(prevState => [...prevState, { idProducto: product.idProducto, cantidad }]);
  //     // this.imagenBase64.update(prevState => [...prevState,convert]);
  //   }
  // }


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

  getImagenBase64() {
    this.cart().forEach(async (product) => {
      if (product.imagenes && product.imagenes.length > 0) {
        // this.imagenBase64 = await this.imageUrlToBase64(this.baseUrl+'uploads/'+product.imagenes[0]);
        // this.imagenBase64 += this.encodeToBase64(this.baseUrl+'uploads/'+ product.imagenes[0]);
        this.imagenBase64 = this.baseUrl + 'uploads/' + product.imagenes[0];
      }
    });
  }

  encodeToBase64(text: string): string {
    return btoa(text);
  }

  // Método para convertir desde una URL
  async imageUrlToBase64(imageUrl: string): Promise<string> {
    try {
      const blob = await this.http.get(imageUrl, { responseType: 'blob' }).toPromise();
      return await this.blobToBase64(blob!);
    } catch (error) {
      console.error('Error converting image:', error);
      throw error;
    }
  }

  // Conversión genérica desde Blob
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(blob);
    });
  }
}
