import { UsuarioResponse } from "./UsuarioResponse";

export interface LoginResponse {
    message: string;
    access_token: string;
    rol: string;
    usuario: {
        idUsuario: number;
        [key: string]: any;
      };
  }