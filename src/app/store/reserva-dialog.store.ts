import { httpResource } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Reserva } from '../model/reserva';
import { ReservaService } from '../services/reserva.service';

@Service({ autoProvided: true })
export class ReservaDialogStore {
  private readonly reservaService = inject(ReservaService);
  readonly $id = signal<number | null>(null);

  private readonly $requestUrl = computed(() => {
    const id = this.$id();
    return id === null ? undefined : `${this.reservaService.resourceUrl}/${id}`;
  });

  readonly reservaResource = httpResource<Reserva>(() => this.$requestUrl());

  setId(id: number | null): void {
    this.$id.set(id);
  }
   reload(){
        this.reservaResource.reload();
    }
}
