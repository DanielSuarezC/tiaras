import { cliente } from "../../clientes/entities/cliente";
import { Item } from "./item";

export class pedido {

    idPedido?: number;
    cliente?: cliente;
    evento?: string;
    fechaPedido?: Date;
    fechaEntrega?: Date;
    valorTotal?: number;
    valorPagado?: number;
    estadoPago?: string;
    estadoPedido?: string;
    items?: Item[];

}

