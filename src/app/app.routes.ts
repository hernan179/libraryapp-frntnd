import { Routes } from '@angular/router';
import { LibrosComponent } from './pages/libros/libros.component';
import { LibrosEditComponent } from './pages/libros/libros-edit/libros-edit.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { SearchComponent } from './pages/search/search.component';

  export const routes: Routes = [
    { path: 'pages/libros', component: LibrosComponent, children: [
        { path: 'new', component: LibrosEditComponent },
        { path: 'edit/:id', component: LibrosEditComponent }
    ]},
    { path: 'pages/search', component: SearchComponent},
    { path: 'pages/categorias', component: CategoriasComponent},
    { path: 'pages/clientes', component: ClientesComponent},
    { path: 'pages/reserva', component: ReservaComponent},
    { path: 'pages/layout', component: LayoutComponent},
    { path: '', component: LayoutComponent}
];
