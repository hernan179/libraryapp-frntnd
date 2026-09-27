import { AfterViewInit, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter, switchMap, tap } from 'rxjs';
import { Reserva } from '../../model/reserva';
import { ReservaService } from '../../services/reserva.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../shared/services/notification.service';
import { ReservaStore } from '../../store/reserva.store';
import { ReservaDialogComponent } from './reserva-dialog/reserva-dialog.component';
import { DetalleReserva } from '../../model/detalleReserva';
import { FormControl, Validators ,ReactiveFormsModule} from '@angular/forms';
import { MatOption } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-reserva',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    DatePipe
],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css',
})
export class ReservaComponent implements AfterViewInit {
  private readonly reservaService = inject(ReservaService);
  private readonly reservaStore = inject(ReservaStore);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  @ViewChild(MatSort) private sort!: MatSort;

  protected readonly displayedColumns = ['idReserva', 'fechaReserva', 'cliente','estado', 'libro','detalleReserva', 'acciones'];
  protected readonly dataSource = new MatTableDataSource<Reserva>();

     private readonly snackBar = inject(MatSnackBar);


  labelsDR: DetalleReserva[];


 show = signal(true);


  constructor() {
    this.dataSource.filterPredicate = (reserva, filter) =>
      `${reserva.idReserva} ${reserva.detalleReserva} ${reserva.cliente?.nombres ?? ''} ${reserva.cliente.apellidos ?? ''} ${reserva.cliente?.cedula ?? ''}`
        .toLowerCase()
        .includes(filter);

    effect(() => {
      this.dataSource.data = this.reservaStore.$reservas();

    });

    effect(() => {
      const message = this.notificationService.$message();
      if(message){
        this.snackBar.open(message, 'INFO', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
        //limpio para que se muestre el mensaje, sino el signals se queda pegado y no reaccione si no cambia el valor
        this.notificationService.clear();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  protected applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  protected openDialog(idReserva?: number,idDetalle?:number): void {
    this.dialog
      .open(ReservaDialogComponent, { width: '700px', data: idReserva ?? null })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reservaStore.reload());
  }

  protected delete(idReserva: number): void {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.reservaService.delete(idReserva)),
        tap(() => this.notificationService.notify('DELETED')),
      )
      .subscribe(() => this.reservaStore.reload());
  }
}
