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
export class AddProductComponent implements OnInit{

form: FormGroup;

  category_result: Categoria[] = [];
  proveedor_result: Proveedor[] = [];
  editproducto: any
  Operacion: string = 'Agregar'


constructor(private fb: FormBuilder,
private _ProductService: ApiService,
private _CategoryService: ApiService,
private _ProveedorService: ProveedorService,
private dialogRef: MatDialogRef<AddProductComponent>,
private dialogRef1: MatDialog,
@Inject(MAT_DIALOG_DATA) public data: any,
)
 {
  this.form = this.fb.group({
    Nombre: ['',Validators.required],
    Unidades: ['',Validators.required],
    Precio: ['',Validators.required],
    Estado: ['',Validators.required],
    Categoria: ['',Validators.required],
    Proveedor: ['',Validators.required],
  })
}

CloseAddProduct(): void
{
  this.dialogRef.close();
}
  ngOnInit(): void{
    
  this.MostrarCategoria();
  this.MostrarProveedor();
  }

  MostrarCategoria(){
    this._CategoryService.getCategory().subscribe(category_result =>{
      this.category_result = category_result 
      console.log(category_result)
    })
  }

  MostrarProveedor(){
    this._ProveedorService.getProveedor().subscribe(proveedor_result =>{
      this.proveedor_result = proveedor_result
      console.log(proveedor_result);
    })
  }

  addProduct() {
    const nombre = this.form.value.Nombre;
    const unidades = this.form.value.Unidades;
    const precio = this.form.value.Precio;
    const estado = this.form.value.Estado;
    const categoria = this.form.value.Categoria;
    const proveedor = this.form.value.Proveedor;
  

    if (!nombre || !unidades || !precio || !estado || !categoria || !proveedor) {

      console.error('Por favor completa todos los campos.');
      return; 
    }
  

    const product: Producto = {
      NOMBRE: nombre,
      UNIDADES: unidades,
      PRECIO: precio,
      ESTADO: estado,
      IDCATEGORIA: categoria.IDCATEGORIA,
      IDPROVEEDOR: proveedor.IDPROVEEDOR
    };
  

    const jsonProduct = JSON.stringify(product);
  
    console.log('Datos del producto:', jsonProduct);
  

    this._ProductService.saveProducts(product).subscribe(() => {
      console.log('Producto Agregado');
    });
  
    this.OpenAddProduct();
  }
  

  OpenAddProduct(): void {
    this.dialogRef1.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'agregado',
        TituloModal: 'Producto'
      }
    }).afterClosed().subscribe(()=>{
      this.CloseAddProduct();
    })
    
  }
}
