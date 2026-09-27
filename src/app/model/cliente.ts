import { Reserva } from "./reserva";


export class Cliente {
    idCliente: number;
    nombres: string;
    apellidos: string;
    cedula: string;
    email: boolean;
    reservas: Reserva[];
}

