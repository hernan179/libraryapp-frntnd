import { Categorias } from "./categorias";
import { Reserva } from "./reserva";

export class Libros{
    idLibro: number;
    titulo: string;
    autor: string;
    isbn : string;
    disponible: boolean;
    categoria: Categorias;
    reserva: Reserva[];
}
