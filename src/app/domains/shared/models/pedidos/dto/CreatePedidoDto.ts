import { CreateItemDto } from "./CreateItemDto";

export class CreatePedidoDto {
    cedula: number;
    evento: string;
    direccion: string;
    fechaEntrega: Date;
    valorTotal: number;
    items: CreateItemDto[];
}