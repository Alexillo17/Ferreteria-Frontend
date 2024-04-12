import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/interfaces/producto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit{

form: FormGroup;

categorias = [
  { id: 1, nombre: 'Herramientas' },
  { id: 2, nombre: 'Accesorios' }
];

proveedores = [
  { id: 1, nombre: 'Kenny' }
];

constructor(private fb: FormBuilder,
private _ProductService: ApiService,
) {
  this.form = this.fb.group({
    Nombre: ['',Validators.required],
    Unidades: ['',Validators.required],
    Precio: ['',Validators.required],
    Estado: ['',Validators.required],
    Categoria: ['',Validators.required],
    Proveedor: ['',Validators.required],
  })
}

  ngOnInit(): void{
   
  }

  addProduct(){
    const product: Producto = {
      NOMBRE: this.form.value.Nombre,
      UNIDADES: this.form.value.Unidades,
      PRECIO: this.form.value.Precio,
      ESTADO: this.form.value.Estado,
      IDCATEGORIA: this.form.value.Categoria.id,
      IDPROVEEDOR: this.form.value.Proveedor.id
    }

    const jsonProduct = JSON.stringify(product);

    console.log('Datos del producto:', jsonProduct);

    this._ProductService.saveProducts(product).subscribe(()=>{
      console.log('Producto Agregado');
    })
  }

}
