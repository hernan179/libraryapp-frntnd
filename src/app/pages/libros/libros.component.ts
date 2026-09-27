import { Component, effect,computed, inject,viewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LibrosService } from '../../services/libros.service';
import { RouterLink ,RouterOutlet,Router, NavigationEnd} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith, switchMap, tap } from 'rxjs';
import { Libros } from '../../model/libros';
import { MatDialogModule ,MatDialog} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LibrosStore } from '../../store/libros.store';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    MatDialogModule,
    RouterLink],
  selector: 'app-libros',
  styleUrl: './libros.component.css',
  templateUrl: './libros.component.html',
})
export class LibrosComponent {

  private readonly librosService = inject(LibrosService);

  protected displayedColumns: string[] = ['idLibro', 'titulo', 'autor', 'isbn','disponible','categoria','accion'];

  protected readonly dataSource = new MatTableDataSource<Libros>();

    private readonly router = inject(Router);

     private readonly dialog = inject(MatDialog);

      private readonly librosStore = inject(LibrosStore);

      protected $libros = this.librosStore.$libros;

     private readonly notificationService = inject(NotificationService);

       private readonly snackBar = inject(MatSnackBar);


    private readonly $url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
  );

   /*ngOnInit(){
    console.log("----------------component----start..ccccc.-------------");
      this.librosService.findAll().subscribe(data => this.dataSource.data = data);

  }*/

    protected readonly hasChildActive = computed(() =>
    this.$url().startsWith('/pages/libros/new') || this.$url().startsWith('/pages/libros/edit/')
  );

 constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
  }
 private setupTableEffect() {
    effect(() => {
      const data = this.$libros();
       this.dataSource.data = data;
    });
  }
  private setupNotificationEffect(){
    effect(() => {
      const message = this.notificationService.$message();
      if(message){
        this.snackBar.open(message, 'INFO', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
        //limpio para que se muestre el mensaje, sino el signals se queda pegado y no reaccione si no cambia el valor
        this.notificationService.clear();
      }
    });
  }

    delete(idLibro: number){
     console.log("Borrando..."+idLibro);

     this.dialog
     .open(ConfirmDialogComponent)
     .afterClosed()
     .pipe(
      filter( (confirmed) => confirmed),
          switchMap(() => this.librosService.delete(idLibro)),
        tap( () => this.notificationService.notify('DELETED'))
     )
   .subscribe( ()=> this.librosStore.reload());
  }

}
