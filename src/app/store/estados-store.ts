import { httpResource } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { EstadosService } from "../services/estados.service";
import { Estado } from "../model/estado";


@Service({autoProvided: true})
export class EstadosStore{
  private readonly estadosService = inject(EstadosService);

  readonly estadosResource = httpResource<Estado[]>(
    () => this.estadosService.resourceUrl,{ defaultValue: []}
  );

  readonly $estados = this.estadosResource.value;
  readonly $loading = this.estadosResource.isLoading;
  readonly $error = this.estadosResource.error;

  reload(){
    this.estadosResource.reload();
  }
}
