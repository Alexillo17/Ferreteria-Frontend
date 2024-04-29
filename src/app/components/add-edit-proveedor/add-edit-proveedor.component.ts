import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ProveedorService } from 'src/app/service/proveedor.service';

@Component({
  selector: 'app-add-edit-proveedor',
  templateUrl: './add-edit-proveedor.component.html',
  styleUrls: ['./add-edit-proveedor.component.scss']
})
export class AddEditProveedorComponent {

  form: FormGroup
  inputdata: any
  editdata: any 
  IDPROVEEDOR: number;
  Titulo: string = 'Agregar'
  Accion: string = 'Agregar'




  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddEditProveedorComponent>,
    private  fb: FormBuilder,
    private dialogRefModal: MatDialog,
    private _ProveedorService: ProveedorService
  )
  {
    this.form = this.fb.group({
      Codigo: ['',Validators.required],
      Nombre: ['',Validators.required],
      Apellido: ['',Validators.required],
      Correo: ['',Validators.required],
      Telefono: ['',Validators.required],
      Cedula: ['',Validators.required],
      Estado: ['',Validators.required]
    })

    this.IDPROVEEDOR = data?.IDPROVEEDOR || 0;
    
  }

  ngOnInit(): void {
   this.inputdata = this.data;
   if(this.inputdata.IDPROVEEDOR>0){
    this.Titulo = 'Editar'
    this.Accion = 'Editar'
    this.MostrarProveedorporID(this.IDPROVEEDOR)
   }
   else{
    this.IDPROVEEDOR = 0
   }

  }

  AddEditProveedor(){
    const idproveedor = this.form.value.Codigo;
    const nombre = this.form.value.Nombre;
    const apellido = this.form.value.Apellido;
    const correo = this.form.value.Correo;
    const telefono = this.form.value.Telefono;
    const cedula = this.form.value.Cedula;
    const estado = this.form.value.Estado

    if(!idproveedor || !nombre || !apellido || !correo || !telefono || !cedula || !estado){
      console.error('Profavor complete los campos')
      return;
    }

     const proveedor: Proveedor ={
      IDPROVEEDOR: idproveedor,
      Nombre: nombre,
      Apellido: apellido,
      Correo: correo,
      Telefono: telefono,
      Cedula: cedula,
      Estado: estado
     }
     debugger

     const jsonProveedor = JSON.stringify(proveedor);

     console.log('Datos del proveedor', jsonProveedor)

     if(this.IDPROVEEDOR !== 0){
      this._ProveedorService.updateProveedor(this.IDPROVEEDOR, proveedor).subscribe(() =>{
        console.log('Se actualizo el proveedor')
        this.OpenEditProveedor();
      })
     }
     else{
      this._ProveedorService.saveproveedor(proveedor).subscribe(()=>{
      console.log('Proveedor Agregado')
     })

     this.OpenAddProveedor();
     }
  

  }

  CloseAddEditProveedor(){
    this.dialogRef.close();
  }

  OpenAddProveedor(): void {
    this.dialogRefModal.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'agregado',
        TituloModal: 'Proveedor',
        Link: '/list-proveedor'
      }
    });
    
  }

  OpenEditProveedor(): void {
    this.dialogRefModal.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'editado',
        TituloModal: 'Proveedor',
        Link: '/list-proveedor'
      }
    });
    
  }


  MostrarProveedorporID(IDPROVEEDOR: number){
    this._ProveedorService.getProveedorbyID(IDPROVEEDOR).subscribe((proveedor_result: Proveedor) =>{
      this.editdata = proveedor_result
      console.log(this.editdata);
      this.form.setValue({
        Codigo: this.editdata.IDPROVEEDOR,
        Nombre: this.editdata.Nombre,
        Apellido: this.editdata.Apellido,
        Correo: this.editdata.Correo,
        Telefono: this.editdata.Telefono,
        Cedula: this.editdata.Cedula,
        Estado: this.editdata.Estado
      })
      debugger
    })
  }

}
