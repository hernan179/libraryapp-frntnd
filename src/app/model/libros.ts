import { Categorias } from "./categorias";

export class Libros{
    idLibro: number;
    titulo: string;
    autor: string;
    isbn : string;
    disponible: boolean;
    categoria: Categorias;
}
