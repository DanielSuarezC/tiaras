import { Insumo } from "../../insumos/entities/Insumo";
import { Producto } from "./Producto";

export class InsumoProducto{
    idInsumoProducto?: number;
    insumo?: Insumo;
    producto?: Producto;
    cantidad?: number;
}
