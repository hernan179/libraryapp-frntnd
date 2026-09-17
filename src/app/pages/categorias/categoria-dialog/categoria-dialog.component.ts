import { Component,computed, effect, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CategoriasForm } from '../../../forms/categorias.form';
import { Categorias } from '../../../model/categorias';
import { CategoriasService } from '../../../services/categorias.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { CategoriasDialogStore } from '../../../store/categorias-dialog-store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormField,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormRoot],
  selector: 'app-categoria-dialog',
  styleUrl: './categoria-dialog.component.css',
  templateUrl: './categoria-dialog.component.html',
})
export class CategoriaDialogComponent {

  private readonly data = inject<number | null>(MAT_DIALOG_DATA, { optional: true });

  private readonly categoriasDialogStore = inject(CategoriasDialogStore);
  protected readonly categoriasForm = inject(CategoriasForm);
  private readonly categoriasService = inject(CategoriasService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<CategoriaDialogComponent>);


 protected $id = computed(() => this.data ? Number(this.data) : null);
protected $isEdit = computed(() => this.$id() !== null);





constructor(){
  effect(
     () => {
      this.categoriasDialogStore.setId(this.$id());
     }
  );

  effect( () => {
   if(this.categoriasDialogStore.categoriaResource.hasValue()){
     this.categoriasForm.patch(this.categoriasDialogStore.categoriaResource.value());
    }
    });
  }



  cancel(){
        this.dialogRef.close(false);
  }
operate(){
  if(this.categoriasForm.isInvalid()) return;

  const isEdit = this.$isEdit();
    const id = this.$id();
    const categorias: Categorias = this.categoriasForm.value();

  const operation$ = isEdit ?  this.categoriasService.update(id,categorias) : this.categoriasService.save(categorias);

operation$.subscribe(() => {
      this.notificationService.notify(isEdit ? 'UPDATED' : 'CREATED');
      this.dialogRef.close(true);
    });
  }
}
