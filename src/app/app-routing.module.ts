import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ListProductComponent } from './components/list-product/list-product.component';

const routes: Routes = [
{path: '', redirectTo: 'list-product', pathMatch: 'full'},
{path: 'add-product', component: AddProductComponent},
{path: 'list-product', component: ListProductComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
