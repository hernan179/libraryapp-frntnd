import { Component, computed, effect, inject } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReservaForm } from '../../../forms/reserva.form';
import { Reserva } from '../../../model/reserva';
import { ReservaService } from '../../../services/reserva.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ReservaDialogStore } from '../../../store/reserva-dialog.store';
import { ClientesService } from '../../../services/clientes.service';
import { ClientesStore } from '../../../store/clientes.store';
import { Cliente } from '../../../model/cliente';
import { Libros } from '../../../model/libros';
import { LibrosStore } from '../../../store/libros.store';
import {     MatSelectModule, } from '@angular/material/select';
import { EstadosStore } from '../../../store/estados-store';
import { Estado } from '../../../model/estado';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetalleReserva } from '../../../model/detalleReserva';

import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-reserva-dialog',
  imports: [
    FormRoot,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule
],
  templateUrl: './reserva-dialog.component.html',
  styleUrl: './reserva-dialog.component.css',
})
export class ReservaDialogComponent {
  private readonly data = inject<number | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly reservaDialogStore = inject(ReservaDialogStore);
  protected readonly reservaForm = inject(ReservaForm);
  private readonly reservaService = inject(ReservaService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<ReservaDialogComponent>);

   private readonly clientesStore = inject(ClientesStore);
   private readonly libroStore = inject(LibrosStore);
   private readonly estadosStore = inject(EstadosStore);



  libroidform = new FormControl('',Validators.required);
  estadoidform = new FormControl('',Validators.required);
  clienteidform = new FormControl('',Validators.required);


  protected readonly $id = computed(() => (this.data === null || this.data === undefined ? null : Number(this.data)));
  protected readonly $isEdit = computed(() => this.$id() !== null);

  // datetime-local inputs work with strings, while the model holds a Date,
  // so this field is synced manually instead of via formField.
  protected readonly fechaInput = computed(() => toDatetimeLocalInput(this.reservaForm.$model().fechaReserva));

  clientes: Cliente[];
  libros: Libros[];
  estados: Estado[];

  dtlreserva: DetalleReserva[] = [];
  dtrs: DetalleReserva;
  lbr: Libros;
  rsv: Reserva;
  std: Estado;
  clnt: Cliente;


  protected onFechaInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const fechaReserva = (value ? new Date(value) : '') as unknown as Date;
    this.reservaForm.$model.update((current) => ({ ...current, fechaReserva }));
  }

  constructor() {

    effect(
      () => {
     this.clientes = this.clientesStore.$clientes();
     this.libros = this.libroStore.$libros();
     this.estados = this.estadosStore.$estados();
      }
    );

    effect(() => this.reservaDialogStore.setId(this.$id()));
    effect(() => {
      if (this.reservaDialogStore.reservaResource.hasValue()) {
        this.reservaForm.patch(this.reservaDialogStore.reservaResource.value());
      } else if (!this.$isEdit()) {
        this.reservaForm.reset();
      }
    });
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }

  protected operate(): void {

    if (this.reservaForm.isInvalid()) return;

   const id = this.$id();
  const reserva: Reserva = this.reservaForm.value();

  const libro = this.libroidform.value;
  const estado = this.estadoidform.value;
  const cliente = this.clienteidform.value;

  if(!(Number(libro) > 0 && Number(libro) > 0 && Number(estado) > 0)) {
      this.notificationService.notify('Todos los campos son requeridos...');
    return;
  }

this.lbr = new Libros();
this.dtrs = new DetalleReserva();
this.rsv = new Reserva();

this.lbr.idLibro = Number(libro);
//hsa this.dtrs.libro = this.lbr;

this.dtlreserva[0] = this.dtrs;

this.rsv.cliente = new Cliente();
this.rsv.estado = new Estado();

this.rsv.cliente.idCliente = Number(cliente);
this.rsv.estado.idEstado = Number(estado);
this.rsv.libro = this.lbr
this.rsv.fechaReserva = new Date(this.fechaInput());
this.rsv.detalleReserva = this.dtlreserva;

this.rsv.idReserva = id;

    const operation$ = id === null
      ? this.reservaService.save(this.rsv)
      : this.reservaService.update(id, this.rsv);

    operation$.subscribe(() => {
      this.notificationService.notify(id === null ? 'CREATED' : 'UPDATED');
      this.reservaDialogStore.reload();
      this.dialogRef.close(true);
    });

  }
}

function toDatetimeLocalInput(value: Date | string | null | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
 // return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
