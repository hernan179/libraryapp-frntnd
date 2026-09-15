import { inject, Service } from '@angular/core';
import { environment  } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Categorias } from '../model/categorias';

@Service()
// @Injectable({ providedIn: 'root'})// old version < 22
export class CategoriasService {

private url = `${environment.HOST}/v1/categorias`;

private http = inject(HttpClient);

findAll(){
    console.log("----------------service-----------------");
  return this.http.get<Categorias[]>(this.url);
}
}
