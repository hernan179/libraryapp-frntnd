import { Service, signal } from '@angular/core';
import { form, maxLength, minLength, required } from '@angular/forms/signals';
import { Reserva } from '../model/reserva';
import { DetalleReserva } from '../model/detalleReserva';
import { Categorias } from '../model/categorias';

const emptyReserva = (): Reserva => ({
  idReserva: null as unknown as number,
  // datetime-local inputs work with strings; the backend sends/receives ISO strings.
  fechaReserva: '' as unknown as Date,
  cliente: {
    idCliente: null,
    nombres: '',
    apellidos: '',
    cedula: '',
    email: false,
    reservas: [],
  },
  estado: null,
  fechaDevolucion: null,
  detalleReserva: [],
  libro: {
    idLibro: null,
    titulo: '',
    autor: '',
    isbn: '',
    disponible: false,
    categoria: new Categorias,
    reserva: []
  }
});

@Service({ autoProvided: true })
export class ReservaForm {
  readonly $model = signal<Reserva>(emptyReserva());

  readonly $form = form(this.$model, (path) => {
    required(path.fechaReserva);



  });

  readonly isInvalid = () => this.$form().invalid();

  patch(reserva: Reserva): void {
    this.$model.set(reserva);
  }

  value(): Reserva {
    return this.$model();
  }

  reset(): void {
    this.$model.set(emptyReserva());
  }
}
