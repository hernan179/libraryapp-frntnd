import { inject, Service } from "@angular/core";
import { LibrosService } from "../services/libros.service";
import { httpResource } from "@angular/common/http";
import { Libros } from "../model/libros";

@Service({autoProvided: true})
export class LibrosStore{

    private readonly librosService = inject(LibrosService);

    readonly librosResource = httpResource<Libros[]>( () => this.librosService.resourceUrl, { defaultValue: [] } );

    readonly $libros = this.librosResource.value;
    readonly $loading = this.librosResource.isLoading;
    readonly $error = this.librosResource.error;

    reload(){
        this.librosResource.reload();
    }
}
