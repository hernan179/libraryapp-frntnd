import { httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Reserva } from '../model/reserva';
import { ReservaService } from '../services/reserva.service';

@Service({ autoProvided: true })
export class ReservaStore {
  private readonly reservaService = inject(ReservaService);

  readonly reservaResource = httpResource<Reserva[]>(
    () => this.reservaService.resourceUrl,
    { defaultValue: [] },
  );

  readonly $reservas = this.reservaResource.value;

  reload(): void {
    this.reservaResource.reload();

  }
}
