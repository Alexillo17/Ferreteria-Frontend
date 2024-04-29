import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ListProductComponent } from './components/list-product/list-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import {MatDialogModule } from '@angular/material/dialog';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ModalCompletadoComponent } from './components/modal-completado/modal-completado.component';
import { ListCategoryComponent } from './components/list-category/list-category.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ListFacturaComponent } from './components/list-factura/list-factura.component';
import { ListProveedorComponent } from './components/list-proveedor/list-proveedor.component';
import { AddEditProveedorComponent } from './components/add-edit-proveedor/add-edit-proveedor.component'
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ListEmpleadoComponent } from './components/list-empleado/list-empleado.component';
import { AddEditEmpleadoComponent } from './components/add-edit-empleado/add-edit-empleado.component';
import { DetalleFacturaComponent } from './components/detalle-factura/detalle-factura.component';
import { CrearFacturaComponent } from './components/crear-factura/crear-factura.component';
import { AddProductofacturaComponent } from './components/add-productofactura/add-productofactura.component';


@NgModule({
  declarations: [
    AppComponent,
    AddProductComponent,
    ListProductComponent,
    NavBarComponent,
    ModalCompletadoComponent,
    ListCategoryComponent,
    EditProductComponent,
    ListFacturaComponent,
    ListProveedorComponent,
    AddEditProveedorComponent,
    ListEmpleadoComponent,
    AddEditEmpleadoComponent,
    DetalleFacturaComponent,
    CrearFacturaComponent,
    AddProductofacturaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatDialogModule,
    FormsModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
