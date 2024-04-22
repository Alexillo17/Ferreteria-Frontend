import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/interfaces/categoria';
import { Producto } from 'src/app/interfaces/producto';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ApiService } from 'src/app/service/api.service';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {

  category_result: Categoria[] = [];
  proveedor_result: Proveedor[] = [];
  editdata: any = {}
  inputdata: any
  IDPRODUCTO: number;
  form: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private ref: MatDialogRef<EditProductComponent>,
  private service: ApiService,
  private fb: FormBuilder,
  private _CategoryService: ApiService,
  private _ProveedorService: ApiService,
  private _ProductService: ApiService, 
  private dialogRefModal: MatDialog,
){
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

  ngOnInit(): void{
    this.MostrarCategoria();
    this.MostrarProveedor();
    this.inputdata = this.data;
    if(this.inputdata.IDPRODUCTO>0){
      this.MostrarProductoporID(this.IDPRODUCTO)
    }
  }

  CloseAddProduct(): void
{
  this.ref.close();
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


  MostrarProductoporID(IDPRODUCTO: number) {
    this.service.getProductibyID(IDPRODUCTO).subscribe((product_result: Producto) => {
      this.editdata = product_result
     console.log(this.editdata);

     const categoriaSeleccionado = this.category_result.find(categoria => categoria.Nombre === this.editdata.IDCATEGORIA);
     const proveedorSeleccionado = this.proveedor_result.find(proveedor => proveedor.Nombre === this.editdata.IDPROVEEDOR);
    
     console.log(categoriaSeleccionado);
     this.form.patchValue({
      Nombre: this.editdata.NOMBRE,
      Unidades: this.editdata.UNIDADES,
      Precio: this.editdata.PRECIO,
      Estado: this.editdata.ESTADO,
      Categoria: categoriaSeleccionado,
      Proveedor: proveedorSeleccionado,
    })
      debugger;
 });
  } 
  
  Editroduct(){
    const product: Producto = {
      NOMBRE: this.form.value.Nombre,
      UNIDADES: this.form.value.Unidades,
      PRECIO: this.form.value.Precio,
      ESTADO: this.form.value.Estado,
      IDCATEGORIA: this.form.value.Categoria.idCategoria,
      IDPROVEEDOR: this.form.value.Proveedor.idProveedor
    }

    product.IDPRODUCTO = this.IDPRODUCTO;
    this._ProductService.updateProducts(this.IDPRODUCTO, product).subscribe(() =>{
    })

    this.OpenModalCompletado();

  }

  OpenModalCompletado(): void {
    this.dialogRefModal.open(ModalCompletadoComponent, {
      data: {
        TituloModal: 'editado'
      }
    });
    
  }


}
