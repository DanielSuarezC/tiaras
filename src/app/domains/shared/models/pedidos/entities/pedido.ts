import { cliente } from "../../clientes/entities/cliente";
import { Pago } from "../../pagos/dto/pago.entity";

export class pedido {
    idPedido: number;
    cliente: cliente;
    evento: string;
    fechaPedido: Date;
    fechaEntrega: Date;
    valorTotal: number;
    valorPagado: number;
    estadoPago: string;
    estadoPedido: string;
    pagos: Pago[];
}

