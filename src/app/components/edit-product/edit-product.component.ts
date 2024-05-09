import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/interfaces/categoria';
import { Producto } from 'src/app/interfaces/producto';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ApiService } from 'src/app/service/api.service';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';
import { ProveedorService } from 'src/app/service/proveedor.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {

  category_result: Categoria[] = [];
  proveedor_result: Proveedor[] = [];
  editdata: any 
  inputdata: any
  IDPRODUCTO: number;
  form: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private ref: MatDialogRef<EditProductComponent>,
  private service: ApiService,
  private fb: FormBuilder,
  private _CategoryService: ApiService,
  private _ProveedorService: ProveedorService,
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
    Stock: ['',Validators.required],
  })
  this.IDPRODUCTO = data.IDPRODUCTO
  }

  ngOnInit(): void{
    this.inputdata = this.data;
    if(this.inputdata.IDPRODUCTO>0){
      this.MostrarCategoria();
    this.MostrarProveedor();
      this.MostrarProductoporID(this.IDPRODUCTO)
    }
    debugger;
  }

  CloseAddProduct(): void
{
  this.ref.close();
}

async MostrarCategoria() {
  try {
    const category_result = await this._CategoryService.getCategory().toPromise();
    this.category_result = category_result || [];
    console.log(category_result);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
  }
}

async MostrarProveedor() {
  try {
    const proveedor_result = await this._ProveedorService.getProveedorInactivos().toPromise();
    this.proveedor_result = proveedor_result || [];
    console.log(proveedor_result);

    if (this.inputdata.IDPRODUCTO > 0) {
      this.MostrarProductoporID(this.IDPRODUCTO);
    }
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
  }
}


  async MostrarProductoporID(IDPRODUCTO: number) {
    try {
      const product_result: Producto | undefined = await this.service.getProductibyID(IDPRODUCTO).toPromise();
      if (product_result) {
        this.editdata = product_result;
        console.log(this.editdata);
  
        const categoriaSeleccionado = this.category_result.find(categoria => categoria.Nombre === this.editdata.IDCATEGORIA);
        const proveedorSeleccionado = this.proveedor_result.find(proveedor => proveedor.Nombre === this.editdata.IDPROVEEDOR);
        debugger;
        console.log(categoriaSeleccionado);
        this.form.patchValue({
          Nombre: this.editdata.NOMBRE,
          Unidades: this.editdata.UNIDADES,
          Precio: this.editdata.PRECIO,
          Estado: this.editdata.ESTADO,
          Stock: this.editdata.Stock,
          Categoria: categoriaSeleccionado,
          Proveedor: proveedorSeleccionado,
        });
        debugger;
      } else {
        console.error("No se encontró ningún producto con el ID especificado.");
      }
    } catch (error) {
      console.error("Error al mostrar el producto:", error);
    }
  }
  
  
  Editroduct(){
    const product: Producto = {
      NOMBRE: this.form.value.Nombre,
      UNIDADES: this.form.value.Unidades,
      PRECIO: this.form.value.Precio,
      ESTADO: this.form.value.Estado,
      Stock: this.form.value.Stock,
      IDCATEGORIA: this.form.value.Categoria.IDCATEGORIA,
      IDPROVEEDOR: this.form.value.Proveedor.IDPROVEEDOR
    }

    product.IDPRODUCTO = this.IDPRODUCTO;
    this._ProductService.updateProducts(this.IDPRODUCTO, product).subscribe(() =>{
    })

    this.OpenModalCompletado();

  }

  OpenModalCompletado(): void {
    this.dialogRefModal.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'editado',
        TituloModal: 'Producto',
      }
    }).afterClosed().subscribe(()=>{
      this.CloseAddProduct();
    });
    
  }


}
