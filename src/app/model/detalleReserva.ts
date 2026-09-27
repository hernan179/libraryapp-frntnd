import { Reserva } from "./reserva";
import { Libros } from "./libros";

export class DetalleReserva{
  idDetalleReserva: number;
  fechaEvento: Date;
  fechaEntrega: Date;
  actualizacion: Date;
  reserva: Reserva;
  detalle: string;
}
