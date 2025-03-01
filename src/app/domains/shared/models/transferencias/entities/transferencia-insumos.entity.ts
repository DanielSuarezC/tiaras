import { Inventario } from "../../inventarios/entities/inventario.entity";
import { InsumoItemTransferencia } from "./insumo-item-transferencia.entity";

export class TransferenciaInsumos {
    idTransferencia: number;
    inventarioOrigen: Inventario;
    inventarioDestino: Inventario;
    insumosItemsTransferencia: InsumoItemTransferencia[];
    observaciones: string;
    fecha: Date;
}