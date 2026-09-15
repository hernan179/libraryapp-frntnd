import { Component, inject,effect } from '@angular/core';
import { CategoriasService } from '../../services/categorias.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Categorias } from '../../model/categorias';


@Component({
  imports: [MatTableModule],
  selector: 'app-categorias',
  styleUrl: './categorias.component.css',
  templateUrl: './categorias.component.html',
})
export class CategoriasComponent {

  private readonly categoriasService = inject(CategoriasService);


  //protected categorias: Categorias[] = [];

    protected displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'estado'];

    protected readonly dataSource = new MatTableDataSource<Categorias>();


 /* ngOnInit(){
    console.log("----------------component----start..ccccc.-------------");
      this.categoriasService.findAll().subscribe(data => this.dataSource.data = data);

  }*/

    constructor() {
    this.setupTableEffect();
  }

  private setupTableEffect() {
    effect(() => {
    this.categoriasService.findAll().subscribe(data => this.dataSource.data = data);
      // this.dataSource.data = data;
    });
  }

}
