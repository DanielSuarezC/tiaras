import { CreateItemDto } from "./CreateItemDto";

export class CreatePedidoDto {
    idCliente?: number;
    evento?: string;
    fechaPedido?: Date;
    fechaEntrega?: Date;
    valorTotal?: number;
    valorPagado?: number;
    estadoPago?: 'Pendiente' | '50% Pagado' |'100% Pagado' ;
    estadoPedido?: 'Pendiente' | 'En Proceso' | 'Terminado' |  'Incidencia';
    items?: CreateItemDto[];

}