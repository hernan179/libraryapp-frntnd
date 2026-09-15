import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Libros } from '../model/libros';
import { GenericService } from './generic.service';

@Service()
export class LibrosService  extends GenericService<Libros>{

    protected override url = `${environment.HOST}/v1/libros`;


}
