import { computed, inject, Service, signal } from "@angular/core";
import { LibrosService } from "../services/libros.service";
import { httpResource } from "@angular/common/http";
import { Libros } from "../model/libros";

@Service({ autoProvided: false })
export class LibrosEditStore{

    private readonly librosService = inject(LibrosService);
    readonly $id = signal<number | null>(null);

    private readonly $librosRequest = computed(() => {
        const id = this.$id();

        return id ? `${this.librosService.resourceUrl}/${id}` : undefined;
    });

    readonly librosResource = httpResource<Libros>(() => this.$librosRequest());

    setId(id: number | null){
        this.$id.set(id);
    }
}
