import { Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Reserva } from '../model/reserva';
import { GenericService } from './generic.service';

@Service()
export class ReservaService extends GenericService<Reserva> {
  protected override url = `${environment.HOST}/v1/reserva`;
}
