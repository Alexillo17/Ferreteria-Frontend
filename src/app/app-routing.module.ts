import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ListProductComponent } from './components/list-product/list-product.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ListCategoryComponent } from './components/list-category/list-category.component';
import { ListFacturaComponent } from './components/list-factura/list-factura.component';
import { ListProveedorComponent } from './components/list-proveedor/list-proveedor.component';
import { AddEditProveedorComponent } from './components/add-edit-proveedor/add-edit-proveedor.component';
import { ListEmpleadoComponent } from './components/list-empleado/list-empleado.component';
import { DetalleFacturaComponent } from './components/detalle-factura/detalle-factura.component';
import { CrearFacturaComponent } from './components/crear-factura/crear-factura.component';
import { AddProductofacturaComponent } from './components/add-productofactura/add-productofactura.component';

const routes: Routes = [
{path: '', redirectTo: 'list-product', pathMatch: 'full'},
{path: 'add-product', component: AddProductComponent},
{path: 'edit-product/:IDPRODUCTO', component: AddProductComponent},
{path: 'list-product', component: ListProductComponent},
{path: 'nav-bar', component: NavBarComponent},
{path: 'list-category', component: ListCategoryComponent},
{path: 'list-factura', component: ListFacturaComponent},
{path: 'list-proveedor', component: ListProveedorComponent},
{path: 'add-edit-proveedor', component: AddEditProveedorComponent},
{path: 'list-empleado', component: ListEmpleadoComponent},
{path: 'detalle-factura', component: DetalleFacturaComponent},
{path: 'crear-factura', component: CrearFacturaComponent},
{path: 'addproducto-factura', component: AddProductofacturaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
