import { Producto } from "../../product/entities/Producto";

export class Categoria {
    id_categoria?: number;
    nombre?: string;
    productos?: Producto[];
}