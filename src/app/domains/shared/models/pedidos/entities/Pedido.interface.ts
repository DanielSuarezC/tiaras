export interface Pedido {
    idPedido: number;
    cliente: Cliente;
    evento: string;
    direccion: string;
    fechaPedido: string; // Se puede convertir a Date si es necesario
    fechaEntrega: string; // Se puede convertir a Date si es necesario
    valorTotal: number;
    valorPagado: number;
    estadoPago: string;
    estadoPedido: string;
    items: ItemPedido[];
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
