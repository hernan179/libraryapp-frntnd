import { httpResource } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Categorias } from "../model/categorias";
import { CategoriasService } from "../services/categorias.service";


@Service({autoProvided: true})
export class CategoriasStore{
  private readonly categoriasservice = inject(CategoriasService);

  readonly categoriesResource = httpResource<Categorias[]>(
    () => this.categoriasservice.resourceUrl,{ defaultValue: []}
  );

  readonly $categorias = this.categoriesResource.value;
  readonly $loading = this.categoriesResource.isLoading;
  readonly $error = this.categoriesResource.error;

  reload(){
    this.categoriesResource.reload();
  }
}
