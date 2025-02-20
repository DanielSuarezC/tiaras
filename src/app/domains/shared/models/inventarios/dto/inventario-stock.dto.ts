import { InsumoStock } from "./insumo-stock.dto";
import { ProductoStock } from "./producto-stock.dto";

export class InventarioStock {
    insumos: InsumoStock[];
    productos: ProductoStock[];
}