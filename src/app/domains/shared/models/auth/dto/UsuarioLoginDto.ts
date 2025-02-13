import { IsEmail, IsNotEmpty } from "class-validator";

export class UsuarioLoginDto{
    @IsEmail({}, {message: 'El email debe ser un email válido'})
    @IsNotEmpty({message: 'El email es requerido'})
    email?: string;
    
    @IsNotEmpty({message: 'La contraseña es requerida'})
    password?: string;
    }