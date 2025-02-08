import { CreateItemDto } from "./CreateItemDto";

export class CreatePedidoDto {
    idCliente?: number;
    cedula?: number;
    evento?: string;
    fechaEntrega?: Date;
    valorTotal?: number;
    estadoPedido?: 'Pendiente' | 'En Proceso' | 'Terminado' |  'Incidencia';
    items?: CreateItemDto[];

}