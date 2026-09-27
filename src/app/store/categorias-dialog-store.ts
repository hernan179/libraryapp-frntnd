import { computed, inject, Service, signal } from "@angular/core";
import { CategoriasService } from "../services/categorias.service";
import { httpResource } from "@angular/common/http";
import { Categorias } from "../model/categorias";


@Service({ autoProvided:true })
export class CategoriasDialogStore{
  private readonly categoriasService = inject(CategoriasService);

  readonly $id = signal<number | null>(null);

  private readonly $categoriasrequest = computed( () =>{
    const id = this.$id();
     return id ? `${this.categoriasService.resourceUrl}/${id}` : undefined;
});

readonly categoriaResource = httpResource<Categorias>( () => this.$categoriasrequest());

setId(id: number | null){
  this.$id.set(id);
}
   reload(){
        this.categoriaResource.reload();
    }
}
