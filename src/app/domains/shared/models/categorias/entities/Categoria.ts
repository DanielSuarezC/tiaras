import { Producto } from "../../product/entities/Producto";

export class Categoria {
    idCategoria?: number;
    nombre?: string;
    productos?: Producto[];
}