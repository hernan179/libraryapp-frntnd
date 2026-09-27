import { Service, signal } from '@angular/core';
import { form, maxLength, minLength, required } from '@angular/forms/signals';
import { Cliente } from '../model/cliente';

const emptyCliente = (): Cliente => ({
  idCliente: null,
  nombres: '',
  apellidos: '',
  cedula: '',
  email: false,
  reservas: [],
});

@Service({ autoProvided: true })
export class ClientesForm {
  readonly $model = signal<Cliente>(emptyCliente());

  readonly $form = form(this.$model, (path) => {
    required(path.nombres);
    minLength(path.nombres, 3);
    maxLength(path.nombres, 100);
    required(path.apellidos);
    minLength(path.apellidos, 3);
    maxLength(path.apellidos, 100);
    required(path.cedula);
    minLength(path.cedula, 3);
    maxLength(path.cedula, 30);
  });

  readonly isInvalid = () => this.$form().invalid();

  patch(cliente: Cliente): void {
    this.$model.set(cliente);
  }

  value(): Cliente {
    return this.$model();
  }

  reset(): void {
    this.$model.set(emptyCliente());
  }
}
