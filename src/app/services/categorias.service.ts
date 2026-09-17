import { Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Categorias } from '../model/categorias';
import { GenericService } from './generic.service';

@Service()
// @Injectable({ providedIn: 'root'})// old version < 22
  export class CategoriasService extends GenericService<Categorias> {

 protected override url = `${environment.HOST}/v1/categorias`;


}
