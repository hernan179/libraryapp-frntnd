import { Service, signal } from "@angular/core";
import { Categorias } from "../model/categorias";
import { form, maxLength, minLength, required } from "@angular/forms/signals";

const emptyCategorias = (): Categorias => ({
    id: null,
    nombre: '',
    estado: false,
    descripcion: ''
});

@Service({autoProvided: true})
export class CategoriasForm{
    readonly $model = signal<Categorias>(emptyCategorias());

    readonly $form = form(this.$model, (path) => {
      required(path.nombre);
      minLength(path.nombre,3);
      maxLength(path.nombre,100);

    });

    readonly isInvalid = () => this.$form().invalid();

    patch(categorias: Categorias){
        this.$model.set(categorias)
    }

    value(){
          return this.$model();
    }

    reset(){
      this.$model.set(emptyCategorias());
    }
}
