import { Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Estado } from '../model/estado';
import { GenericService } from './generic.service';

@Service()
// @Injectable({ providedIn: 'root'})// old version < 22
  export class EstadosService extends GenericService<Estado> {

  protected override url = `${environment.HOST}/v1/estados`;


}
