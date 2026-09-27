import { Component, computed, effect, inject } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClientesForm } from '../../../forms/clientes.form';
import { Cliente } from '../../../model/cliente';
import { ClientesService } from '../../../services/clientes.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ClientesDialogStore } from '../../../store/clientes-dialog.store';

@Component({
  selector: 'app-clientes-dialog',
  imports: [
    FormField,
    FormRoot,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './clientes-dialog.component.html',
  styleUrl: './clientes-dialog.component.css',
})
export class ClientesDialogComponent {
  private readonly data = inject<number | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly clientesDialogStore = inject(ClientesDialogStore);
  protected readonly clientesForm = inject(ClientesForm);
  private readonly clientesService = inject(ClientesService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<ClientesDialogComponent>);

  protected readonly $id = computed(() => (this.data === null || this.data === undefined ? null : Number(this.data)));
  protected readonly $isEdit = computed(() => this.$id() !== null);

  constructor() {
    effect(() => this.clientesDialogStore.setId(this.$id()));
    effect(() => {
      if (this.clientesDialogStore.clienteResource.hasValue()) {
        this.clientesForm.patch(this.clientesDialogStore.clienteResource.value());
      } else if (!this.$isEdit()) {
        this.clientesForm.reset();
      }
    });
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }

  protected operate(): void {
    if (this.clientesForm.isInvalid()) return;

    const id = this.$id();
    const cliente: Cliente = this.clientesForm.value();
    const operation$ = id === null
      ? this.clientesService.save(cliente)
      : this.clientesService.update(id, cliente);

    operation$.subscribe(() => {
    this.notificationService.notify(id === null ? 'CREATED' : 'UPDATED');
     this.dialogRef.close(true);
    });
  }
}
