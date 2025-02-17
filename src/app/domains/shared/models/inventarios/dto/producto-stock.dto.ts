import { Producto } from "../../product/entities/Producto";

export class ProductoStock {
    idProductoStock: number;
    producto: Producto;
    stock: number;
}