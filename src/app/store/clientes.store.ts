import { httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Cliente } from '../model/cliente';
import { ClientesService } from '../services/clientes.service';

@Service({ autoProvided: true })
export class ClientesStore {
  private readonly clientesService = inject(ClientesService);

  readonly clientesResource = httpResource<Cliente[]>(
    () => this.clientesService.resourceUrl,
    { defaultValue: [] },
  );

  readonly $clientes = this.clientesResource.value;

  reload(): void {
    this.clientesResource.reload();
  }
}
