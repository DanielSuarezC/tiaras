export interface Pedido {
    idPedido: number;
    evento: string;
    fechaPedido: string; // Se puede convertir a Date si es necesario
    fechaEntrega: string; // Se puede convertir a Date si es necesario
    valorTotal: string;
    valorPagado: string;
    estadoPago: string;
    estadoPedido: string;
    __items__: ItemPedido[];
    cliente: Cliente;
}

export interface ItemPedido {
    idItem: number;
    cantidad: number;
    producto: Producto;
}

export interface Producto {
    idProducto: number;
    nombre: string;
    descripcion: string;
    precio: string;
    imagenes: string[];
}

export interface Cliente {
    idCliente: number;
    cedula: number;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    direccion: string;
    pais: string;
    ciudad: string;
}
