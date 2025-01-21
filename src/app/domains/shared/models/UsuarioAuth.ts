import { RolAuth } from "./RolAuth";

export class UsuarioAuth {
    idUsuario?: number;
    email?: string;
    password?: string;
    rol?: RolAuth;
    token?:string;
}