import { Service, signal } from "@angular/core";
import { Libros } from "../model/libros";
import { form, maxLength, minLength, required } from "@angular/forms/signals";
import { Categorias } from "../model/categorias";


  const emptyLibros = (): Libros => ({
    idLibro: null,
    titulo: '',
    autor: '',
    isbn : '',
    disponible: false,
    categoria: new Categorias
  });

@Service({autoProvided: false})
export class LibrosForm {

  readonly $model = signal<Libros>(emptyLibros());

 readonly $form = form(this.$model, (path) => {
    required(path.autor);
    minLength(path.autor,3);
    maxLength(path.autor,100);

    required(path.titulo);
    minLength(path.titulo,3);
    maxLength(path.titulo,100);
  });

  readonly isInvalid = () => this.$form().invalid();

  patch(libros: Libros){
    this.$model.set(libros);
  }

  value(){
    return this.$model();
  }

  reset(){
    this.$model.set(emptyLibros());
  }
}
