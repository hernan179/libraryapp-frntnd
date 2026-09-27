import { httpResource } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Cliente } from '../model/cliente';
import { ClientesService } from '../services/clientes.service';

@Service({ autoProvided: true })
export class ClientesDialogStore {
  private readonly clientesService = inject(ClientesService);
  readonly $id = signal<number | null>(null);

  private readonly $requestUrl = computed(() => {
    const id = this.$id();
    return id === null ? undefined : `${this.clientesService.resourceUrl}/${id}`;
  });

  readonly clienteResource = httpResource<Cliente>(() => this.$requestUrl());

  setId(id: number | null): void {
    this.$id.set(id);
  }
}
