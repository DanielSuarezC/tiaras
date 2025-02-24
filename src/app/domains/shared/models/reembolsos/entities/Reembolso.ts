import { cliente } from "../../clientes/entities/cliente";
import { Pedido } from "../../pedidos/entities/Pedido.interface";
import { Usuario } from "../../usuarios/entities/Usuario";

export class Reembolso{
    idReembolso: number;
    cliente: cliente;
    pedido: Pedido;
    vendedor: Usuario; 
    detalles: string;
    valorReembolso: number;
    bancoDestino: string;
    cuentaBancaria: string;
    fechaSolicitud: Date;
    estado: string;
    at_created: Date;
    at_updated: Date;
    at_deleted?: boolean;
}