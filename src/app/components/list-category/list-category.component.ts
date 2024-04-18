import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';
import { ApiService } from 'src/app/service/api.service';
import { Categoria } from 'src/app/interfaces/categoria';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent {

  category_result: Categoria[] = [];

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

  OpenModalSucces(){
    this.dialogref.open(ModalCompletadoComponent, 
      {
        data: {
          TituloModal: 'ADD-Category'
        }
      }
    )
  }

}
