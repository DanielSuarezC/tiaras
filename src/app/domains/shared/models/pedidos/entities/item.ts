import { Producto } from "../../product/entities/Producto";
import { pedido } from "./pedido";

export class Item{
    idItem?: number;
    pedido?: pedido;
    producto?: Producto;
    cantidad?: number;
}