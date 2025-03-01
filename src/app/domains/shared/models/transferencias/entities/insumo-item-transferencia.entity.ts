import { Insumo } from "../../insumos/entities/Insumo";
import { TransferenciaInsumos } from "./transferencia-insumos.entity";

export class InsumoItemTransferencia {
    idItemTransferencia: number;
    transferencia: TransferenciaInsumos;
    insumo: Insumo;
    cantidad: number;
}