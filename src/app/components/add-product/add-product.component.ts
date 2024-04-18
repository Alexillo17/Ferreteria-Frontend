import { Component, Inject, OnInit } from '@angular/core';
import { Producto } from 'src/app/interfaces/producto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/interfaces/categoria';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit{

form: FormGroup;

  category_result: Categoria[] = [];
  proveedor_result: Proveedor[] = [];
  IDPRODUCTO: number;


constructor(private fb: FormBuilder,
private _ProductService: ApiService,
private _CategoryService: ApiService,
private _ProveedorService: ApiService,
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
  this.IDPRODUCTO = data.IDPRODUCTO
}

CloseAddProduct(): void
{
  this.dialogRef.close();
}
  ngOnInit(): void{
  this.MostrarCategoria();
  this. MostrarProveedor();
  debugger
  this.MostrarProductoporID(this.IDPRODUCTO)
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
      debugger
      console.log(proveedor_result);
    })
  }

  MostrarProductoporID(IDPRODUCTO: number){
    this._ProductService.getProductibyID(IDPRODUCTO).subscribe((data: Producto) =>{
      this.data = data
      debugger;
      console.log(data);
    }
    )
  }

  addProduct(){
    const product: Producto = {
      NOMBRE: this.form.value.Nombre,
      UNIDADES: this.form.value.Unidades,
      PRECIO: this.form.value.Precio,
      ESTADO: this.form.value.Estado,
      IDCATEGORIA: this.form.value.Categoria.idCategoria,
      IDPROVEEDOR: this.form.value.Proveedor.idProveedor
    }

    const jsonProduct = JSON.stringify(product);

    console.log('Datos del producto:', jsonProduct);

    this._ProductService.saveProducts(product).subscribe(()=>{
      console.log('Producto Agregado');
    })

    this.OpenAddProduct();

  }



  OpenAddProduct(): void {
    this.dialogRef1.open(ModalCompletadoComponent, {
      data: {
        TituloModal: 'ADD'
      }
    });
    
  }

 
 
}
