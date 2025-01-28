import { Categoria } from "../../categorias/entities/Categoria";
import { InsumoProducto } from "./InsumoProducto";

export class Producto {
    idProducto?: number;
    nombre?: string;
    descripcion?: string;
    precio?: number;
    imagenes?: string[];
    categorias?: Categoria[];
    insumos?: InsumoProducto[];
}