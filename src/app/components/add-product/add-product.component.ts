import { Component, Inject, OnInit } from '@angular/core';
import { Producto } from 'src/app/interfaces/producto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/interfaces/categoria';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';
import { ProveedorService } from 'src/app/service/proveedor.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  form: FormGroup;
  category_result: Categoria[] = [];
  proveedor_result: Proveedor[] = [];
  editproducto: any
  Operacion: string = 'Agregar'

  constructor(
    private fb: FormBuilder,
    private _ProductService: ApiService,
    private _CategoryService: ApiService,
    private _ProveedorService: ProveedorService,
    private dialogRef: MatDialogRef<AddProductComponent>,
    private dialogRef1: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      Nombre: ['', Validators.required],
      Unidades: ['', Validators.required],
      Precio: ['', Validators.required],
      Estado: ['', Validators.required],
      Categoria: ['', Validators.required],
      Proveedor: ['', Validators.required],
      Stock: ['', Validators.required],
      Fecha: ['', Validators.required]
    });
  }

  CloseAddProduct(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.MostrarCategoria();
    this.MostrarProveedor();
    this.setFechaActual();
  }

  MostrarCategoria() {
    this._CategoryService.getCategory().subscribe(category_result => {
      this.category_result = category_result;
      console.log(category_result);
    });
  }

  MostrarProveedor() {
    this._ProveedorService.getProveedor().subscribe(proveedor_result => {
      this.proveedor_result = proveedor_result;
      console.log(proveedor_result);
    });
  }

  setFechaActual() {
    const fechaActual = new Date().toISOString().split('T')[0];
    this.form.patchValue({ Fecha: fechaActual });
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async addProduct() {
    const nombre = this.form.value.Nombre;
    const unidades = this.form.value.Unidades;
    const precio = this.form.value.Precio;
    const estado = this.form.value.Estado;
    const categoria = this.form.value.Categoria;
    const proveedor = this.form.value.Proveedor;
    const stock = this.form.value.Stock;
    const fecha = this.form.value.Fecha;
  
    if (!nombre || !unidades || !precio || !estado || !categoria || !proveedor || !fecha) {
      console.error('Por favor completa todos los campos.');
      return;
    }
  
    // Formatear la fecha a mm/dd/yyyy
    const [year, month, day] = fecha.split('-');
    const formattedFecha = `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;

  
    const product: Producto = {
      NOMBRE: nombre,
      UNIDADES: unidades,
      PRECIO: precio,
      ESTADO: estado,
      IDCATEGORIA: categoria.IDCATEGORIA,
      IDPROVEEDOR: proveedor.IDPROVEEDOR,
      Stock: stock,
      Fecha: formattedFecha // Usar la fecha formateada
    };

    debugger
  
    const jsonProduct = JSON.stringify(product);
    console.log('Datos del producto:', jsonProduct);
  
    try {
      await this._ProductService.saveProducts(product).toPromise();
      console.log('Producto Agregado');
      this.OpenAddProduct();
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  }
  
  

  OpenAddProduct(): void {
    this.dialogRef1.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'agregado',
        TituloModal: 'Producto'
      }
    }).afterClosed().subscribe(() => {
      this.CloseAddProduct();
    });
  }
}
