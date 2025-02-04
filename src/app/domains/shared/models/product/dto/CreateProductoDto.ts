import { InsumoProducto } from "../entities/InsumoProducto";

export class CreateProductoDto {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    categorias?: number[];
    insumos?: {idInsumo: number, cantidad: number}[];
}

// export interface InsumoProducto{
//     idInsumo: string;
//     cantidad: string;
// }