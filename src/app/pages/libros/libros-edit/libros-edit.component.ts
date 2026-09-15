
import { form, FormField,FormRoot} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { LibrosForm } from '../../../forms/libros.form';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, effect, inject } from '@angular/core';


import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Libros } from '../../../model/libros';
import { LibrosService } from '../../../services/libros.service';

import { NotificationService } from '../../../shared/services/notification.service';

import { LibrosStore } from '../../../store/libros.store';

import { MatInputModule } from '@angular/material/input';
import { LibrosEditStore } from '../../../store/LibrosEditStore';
import { MatCheckboxModule } from '@angular/material/checkbox';


import {MatSelectModule} from '@angular/material/select';
import { CategoriasService } from '../../../services/categorias.service';
import { MatTableDataSource } from '@angular/material/table';
import { Categorias } from '../../../model/categorias';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormField,
    FormRoot,
    RouterLink,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule
],
  selector: 'app-libros-edit',
  styleUrl: './libros-edit.component.css',
  templateUrl: './libros-edit.component.html',
  providers: [LibrosForm,LibrosEditStore]
})
export class LibrosEditComponent {
    protected readonly librosForm = inject(LibrosForm);
    private readonly librosService = inject(LibrosService);

     private readonly categoriasService = inject(CategoriasService);

    private readonly librosEditStore = inject(LibrosEditStore);

    private readonly router = inject(Router);

   private readonly route = inject(ActivatedRoute);

   private readonly notificationService = inject(NotificationService);

   private readonly librosStore = inject(LibrosStore);

  private readonly $params = toSignal(this.route.params, { initialValue: {} });

  protected $id = computed(() => {
    const id = this.$params()['id'];
    return id ? Number(id) : null;
  });

  protected $isEdit = computed(() => this.$id() !== null);

  protected readonly dataSourceCategorias = new MatTableDataSource<Categorias>();


   labels: Categorias[];
   foodControl = new FormControl('',Validators.required);


  constructor(){
     effect( () => {
       this.librosEditStore.setId(this.$id());

        this.categoriasService.findAll().subscribe(data =>
         // this.dataSourceCategorias.data = data
         this.labels = data
     );

     });

     effect( () => {
      if(this.librosEditStore.librosResource.hasValue()){
         this.librosForm.patch(this.librosEditStore.librosResource.value());
      }

     console.log('================');
     //console.log(this.librosForm.$form.categoria);

     });

  }


 operate(){
  if(this.librosForm.isInvalid()) return;

    const isEdit = this.$isEdit();
    const id = this.$id();
    const libros: Libros = this.librosForm.value();

     console.log("updating....00 "+this.foodControl.value);

  libros.categoria = new Categorias();
  libros.categoria.id = Number(this.foodControl.value);

  if(libros.categoria.id> 0){
 console.log("todo esta correcto.........");
  }else{
     console.log(" errorrrr   correcto.........");
    return;
  }

    console.log("updating....00 "+ libros.categoria.id);

    const operation$ = isEdit ? this.librosService.update(id, libros) : this.librosService.save(libros);

      operation$.subscribe( ()=> {

      this.librosStore.reload();

      this.notificationService.notify(isEdit ? 'UPDATED' : 'CREATED');

      this.router.navigate(['/pages/libros']);
      console.log("updating....07 ");

    });
  }

}
