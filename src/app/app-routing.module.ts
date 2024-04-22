import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ListProductComponent } from './components/list-product/list-product.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ListCategoryComponent } from './components/list-category/list-category.component';
import { ListFacturaComponent } from './components/list-factura/list-factura.component';

const routes: Routes = [
{path: '', redirectTo: 'list-product', pathMatch: 'full'},
{path: 'add-product', component: AddProductComponent},
{path: 'edit-product/:IDPRODUCTO', component: AddProductComponent},
{path: 'list-product', component: ListProductComponent},
{path: 'nav-bar', component: NavBarComponent},
{path: 'list-category', component: ListCategoryComponent},
{path: 'list-factura', component: ListFacturaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
