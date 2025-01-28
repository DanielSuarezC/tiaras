import { pedido } from "../../pedidos/entities/pedido";

export class cliente {
    
    idCliente?: number;
    nombre?: string; 
    apellidos?: string;
    email?: string; 
    telefono?: string;
    pais?: string; 
    ciudad?: string;
    pedidos?: pedido[];
}