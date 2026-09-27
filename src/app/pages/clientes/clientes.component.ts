import { AfterViewInit, Component, effect, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter, switchMap, tap } from 'rxjs';
import { ClientesService } from '../../services/clientes.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../shared/services/notification.service';
import { ClientesStore } from '../../store/clientes.store';
import { ClientesDialogComponent } from './clientes-dialog/clientes-dialog.component';
import { Cliente } from '../../model/cliente';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clientes',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent implements AfterViewInit {
  private readonly clientesService = inject(ClientesService);
  private readonly clientesStore = inject(ClientesStore);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

     private readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  @ViewChild(MatSort) private sort!: MatSort;

  protected readonly displayedColumns = ['idCliente', 'nombres', 'apellidos', 'cedula', 'email', 'acciones'];
  protected readonly dataSource = new MatTableDataSource<Cliente>();

  constructor() {
    this.dataSource.filterPredicate = (cliente, filter) =>
      `${cliente.nombres} ${cliente.apellidos} ${cliente.cedula}`.toLowerCase().includes(filter);

    effect(() => {
      this.dataSource.data = this.clientesStore.$clientes();
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

  protected openDialog(idCliente?: number): void {
    this.dialog
      .open(ClientesDialogComponent, { width: '400px', data: idCliente ?? null })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.clientesStore.reload());
  }

  protected delete(idCliente: number): void {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.clientesService.delete(idCliente)),
        tap(() => this.notificationService.notify('DELETED')),
      )
      .subscribe(() => this.clientesStore.reload());
  }
}
