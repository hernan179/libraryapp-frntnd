import { Component, inject,effect } from '@angular/core';
import { CategoriasService } from '../../services/categorias.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Categorias } from '../../model/categorias';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoriaDialogComponent } from './categoria-dialog/categoria-dialog.component';


import { filter, switchMap, tap } from 'rxjs';
import { CategoriasStore } from '../../store/categorias-score';

import { RouterLink ,RouterOutlet,Router, NavigationEnd} from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../shared/services/notification.service';
import { MatButtonModule } from '@angular/material/button';


@Component({
  imports: [MatTableModule,
    MatIconModule,
    MatDialogModule,
      MatButtonModule
    ],
  selector: 'app-categorias',
  styleUrl: './categorias.component.css',
  templateUrl: './categorias.component.html',
})
export class CategoriasComponent {

  private readonly categoriasService = inject(CategoriasService);

  private readonly categoriasStore = inject(CategoriasStore);

private readonly dialog = inject(MatDialog);

  //protected categorias: Categorias[] = [];

    protected displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'estado','acciones'];

    protected readonly dataSource = new MatTableDataSource<Categorias>();

  private readonly notificationService = inject(NotificationService);


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


 openDialog(idCategoria?: number){
   this.dialog
    .open(CategoriaDialogComponent, { width: '400px', data: idCategoria ?? null })
    .afterClosed()
    .pipe(filter((saved) => saved))
    .subscribe(() => this.categoriasStore.reload());

  }


 delete(idCategoria: number){
     console.log("Borrando..."+idCategoria);

     this.dialog
     .open(ConfirmDialogComponent)
     .afterClosed()
     .pipe(
      filter( (confirmed) => confirmed),
          switchMap(() => this.categoriasService.delete(idCategoria)),
        tap( () => this.notificationService.notify('DELETED'))
     )
   .subscribe( ()=> this.categoriasStore.reload());
  }
  }

