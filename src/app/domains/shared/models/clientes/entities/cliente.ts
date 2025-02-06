import { pedido } from "../../pedidos/entities/pedido";

export class cliente {
    
    idCliente?: number;
    cedula?: number;
    nombre?: string; 
    apellidos?: string;
    email?: string; 
    telefono?: string;
    direccion?: string;
    pais?: string; 
    ciudad?: string;
    pedidos?: pedido[];
}