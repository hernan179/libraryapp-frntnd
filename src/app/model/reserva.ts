import { Cliente } from "./cliente";
import { DetalleReserva } from "./detalleReserva";
import { Estado } from "./estado";
import { Libros } from "./libros";

export class Reserva{
  idReserva: number;
  fechaReserva: Date;
  cliente: Cliente;
  libro: Libros;
  estado: Estado;
  detalleReserva: DetalleReserva[];
  fechaDevolucion: Date;
}
