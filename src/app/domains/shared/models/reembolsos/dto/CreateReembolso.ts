export class CreateReembolsoDto{
    idPedido: number;
    idVendedor: number;
    detalles: string;
    valorReembolso: number;
    bancoDestino: string;
    cuentaBancaria: string;
    estado: string;
}