export interface paylod {
    sub: string;
    userId: number;
    rol: "ADMINISTRADOR" | "VENDEDOR";
    iat: number;
    exp: number;
}