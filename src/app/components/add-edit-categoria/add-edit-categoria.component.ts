import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/interfaces/categoria';
import { ApiService } from 'src/app/service/api.service';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';

@Component({
  selector: 'app-add-edit-categoria',
  templateUrl: './add-edit-categoria.component.html',
  styleUrls: ['./add-edit-categoria.component.scss']
})
export class AddEditCategoriaComponent {

  form: FormGroup
  editdata: Categoria | null = null 
  IDCATEGORIA: number
  inputdata: any
  Titulo: string = 'Agregar'
  Accion: string = 'Agregar'
  idExistente: boolean = false;



  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private fb: FormBuilder,
private _CategoriaService: ApiService,
private dialogRefModal: MatDialog,
private dialogRef: MatDialogRef<AddEditCategoriaComponent>

){
  this.form = this.fb.group({
    Codigo: ['', [Validators.required], [this.validarIdExistente.bind(this)]],
    Nombre: ['', Validators.required],
    Estado: ['',Validators.required]
  })   
  this.IDCATEGORIA = data?.IDCATEGORIA || 0;
  }

  ngOnInit(): void {
    this.inputdata = this.data;
    if (this.inputdata.IDCATEGORIA > 0) {
      this.Titulo = 'Editar';
      this.Accion = 'Editar';
      this.MostrarCategoriabyID(this.IDCATEGORIA);
    } else {
      this.IDCATEGORIA = 0;
    }
  }

  OpenEditCategoria(): void{
    this.dialogRefModal.open(ModalCompletadoComponent,{
      data: {
        TituloModalAccion: 'actualizado',
        TituloModal: 'Categoria',
      }
    }).afterClosed().subscribe(()=>{
      this.CloseCategoria();
    })
  }

  OpenAddCategoria(): void{
    this.dialogRefModal.open(ModalCompletadoComponent,{
      data: {
        TituloModalAccion: 'agregado',
        TituloModal: 'Categoria',
      }
    }).afterClosed().subscribe(()=>{
      this.CloseCategoria();
    })
  }

  CloseCategoria(){
    this.dialogRef.close();
  }


  MostrarCategoriabyID(IDCATEGORIA: number): void {
    this._CategoriaService.getCategoriabyID(IDCATEGORIA).subscribe((categoria: Categoria) => {
      this.editdata = categoria;
      debugger
      console.log(categoria)
      this.form.setValue({
        Codigo: categoria.IDCATEGORIA,
        Nombre: categoria.Nombre,
        Estado: categoria.Estado
      });
    });
  }

  AddEditCategoria(){
    const idcategoria = this.form.value.Codigo;
    const nombre = this.form.value.Nombre;
    const estado = this.form.value.Estado;

    if(!idcategoria || !nombre){
      console.error('Rellene los campos');
      return;
    }

    const categoria: Categoria = {
      IDCATEGORIA: idcategoria,
      Nombre: nombre,
      Estado: estado
    }

    const jsoncategoria = JSON.stringify(categoria);

    console.log(jsoncategoria)

    if(this.IDCATEGORIA !== 0){
      this._CategoriaService.updateCategoria(this.IDCATEGORIA, categoria).subscribe(()=>{
        debugger
        console.log('Categoria Actualizada');
      })
      this.OpenEditCategoria();
    }
    else{
      debugger
      this._CategoriaService.savecategoria(categoria).subscribe(()=>{
        console.log('Categoria Agregada')
      })
      this.OpenAddCategoria();
    }

  }

  validarIdExistente(control: FormControl): Promise<ValidationErrors | null> {
    const id = control.value;
    if (!id) {
      return Promise.resolve(null);
    }
    return new Promise((resolve, reject) => {
      this._CategoriaService.getCategoriabyID(id).subscribe((categoria: Categoria) => {
        if (categoria && categoria.IDCATEGORIA !== this.IDCATEGORIA) {
          this.idExistente = true;
          resolve({ idExistente: true });
        } else {
          this.idExistente = false;
          resolve(null);
        }
      }, (error) => {
        console.error("Error al buscar proveedor por ID", error);
        reject({ idInvalido: true });
      });
    });
  }
  
  

}
