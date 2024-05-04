import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';
import { ApiService } from 'src/app/service/api.service';
import { Categoria } from 'src/app/interfaces/categoria';
import { AddEditCategoriaComponent } from '../add-edit-categoria/add-edit-categoria.component';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent {

  category_result: Categoria[] = [];
  categoryDis_result: Categoria[] = []

  checkbox: boolean = false
  constructor(private dialogref: MatDialog,
    private _CategoryService: ApiService,
  ){
    
  }

  ngOnInit(): void{
    this.MostrarCategoria();
  }

  MostrarCategoria(){
    this._CategoryService.getCategory().subscribe(category_result =>{
      this.category_result = category_result 
      console.log(category_result)
    })
  }

  MostrarAllCategoria(){
    this._CategoryService.getAllCategory().subscribe(categoryDis_result =>{
      this.categoryDis_result = categoryDis_result 
      console.log(categoryDis_result)
    })
  }

  OpenEditCategoria(IDCATEGORIA?: number): void{
    if(IDCATEGORIA !== undefined && IDCATEGORIA !== null) {
      this.dialogref.open(AddEditCategoriaComponent,{
        disableClose: true,
        data: {IDCATEGORIA: IDCATEGORIA}
      }).afterClosed().subscribe(()=>{
        if (this.checkbox) {
          this.MostrarAllCategoria();
        } else {
          this.MostrarCategoria();
        }
      });
    } 
  }

  OpenAddEditCategory(){
  this.dialogref.open(AddEditCategoriaComponent,{
    disableClose: true
  }).afterClosed().subscribe(()=>{
    if (this.checkbox) {
      this.MostrarAllCategoria();
    } else {
      this.MostrarCategoria();
    }
  })
  }

  toggleCategoriaList() {
    if (this.checkbox) {
      this.MostrarAllCategoria();
    } else {
      this.MostrarCategoria();
    }
  }

  DeleteCategoria(categoria: Categoria): void {
    if (categoria !== undefined && categoria !== null) {
      this._CategoryService.deletecategoria(categoria.IDCATEGORIA, categoria).subscribe(() => {
        console.log('Proveedor Eliminado');
        this.OpenDeleteCategoria();
      });
    }
  }

  OpenDeleteCategoria(){
    this.dialogref.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'eliminado',
        TituloModal: 'Categoria',
      }
    }).afterClosed().subscribe(()=>{
      if (this.checkbox) {
        this.MostrarAllCategoria();
      } else {
        this.MostrarCategoria();
      }
    });
    
  }
  }



