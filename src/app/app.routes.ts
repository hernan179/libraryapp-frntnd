import { Routes } from '@angular/router';
import { LibrosComponent } from './pages/libros/libros.component';
import { LibrosEditComponent } from './pages/libros/libros-edit/libros-edit.component';
import { CategoriasEditComponent } from './pages/categorias/categorias-edit/categorias-edit.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';

  export const routes: Routes = [
    { path: 'pages/libros', component: LibrosComponent, children: [
        { path: 'new', component: LibrosEditComponent },
        { path: 'edit/:id', component: LibrosEditComponent }
    ]},
    { path: 'pages/categorias', component: CategoriasComponent, children: [
        { path: 'new', component: CategoriasEditComponent },
        { path: 'edit/:id', component: CategoriasEditComponent }
    ]},
    { path: 'pages/layout', component: LayoutComponent},
    { path: '', component: LayoutComponent}
];
