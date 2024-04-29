import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Empleado } from 'src/app/interfaces/empleado';
import { ApiService } from 'src/app/service/api.service';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';

@Component({
  selector: 'app-add-edit-empleado',
  templateUrl: './add-edit-empleado.component.html',
  styleUrls: ['./add-edit-empleado.component.scss']
})
export class AddEditEmpleadoComponent {

  form: FormGroup
  inputdata: any
  editdata: any 
  IDEMPLEADO: number;
  Titulo: string = 'Agregar'
  Accion: string = 'Agregar'


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _EmpleadoService: ApiService,
    private dialogRefModal: MatDialog
  ){
    this.form = this.fb.group({
      Codigo: ['',Validators.required],
      Nombre: ['',Validators.required],
      Apellido: ['',Validators.required],
      Telefono: ['',Validators.required],
      Cedula: ['',Validators.required],
    })

     this.IDEMPLEADO = data?.IDEMPLEADO || 0;
  }

  ngOnInit(): void{
    this.inputdata = this.data
    if(this.inputdata.IDEMPLEADO>0){
      this.Titulo = 'Editar';
      this.Accion = 'Editar'
      this.MostrarEmpleadoporID(this.IDEMPLEADO)
    }
    else{
      this.IDEMPLEADO = 0
    }
    debugger;
  }
 
  MostrarEmpleadoporID(IDEMPLEADO: number){
    this._EmpleadoService.getEmpleadobyID(IDEMPLEADO).subscribe((empleado_result: Empleado) =>{
      this.editdata = empleado_result
      console.log(this.editdata);
      this.form.setValue({
        Codigo: this.editdata.IDEMPLEADO,
        Nombre: this.editdata.Nombre,
        Apellido: this.editdata.Apellido,
        Telefono: this.editdata.Telefono,
        Cedula: this.editdata.Cedula,
      })
      debugger;
    })   
  }

  AddEditEmpleado(){
    const idempleado = this.form.value.Codigo;
    const nombre = this.form.value.Nombre;
    const apellido = this.form.value.Apellido;
    const telefono = this.form.value.Telefono;
    const cedula = this.form.value.Cedula;

    if(!idempleado || !nombre || !telefono || !cedula){
      console.error('Relleno los campos')
      return;
    }

     const empleado: Empleado ={
      IDEMPLEADO: idempleado,
      Nombre: nombre,
      Apellido: apellido,
      Telefono: telefono,
      Cedula: cedula
     }
     debugger

     const jsonEmpleado = JSON.stringify(empleado);

     console.log('Datos del empleado', jsonEmpleado);

     if(this.IDEMPLEADO !== 0){
      this._EmpleadoService.updateEmpleado(this.IDEMPLEADO, empleado).subscribe(() =>{
        console.log('Empleado agregado')
      })

      this.OpenEditEmpleado();

     }else{
      this._EmpleadoService.saveEmpleado(empleado).subscribe(() =>{
        console.log('Empleado agregado')
      })

   this.OpenAddEmpleado();

     }
  }

  todosCamposCompletos(): boolean {
    const campos = this.form.controls;
    return Object.keys(campos).every(field => campos[field].valid || field === 'Apellido');
  }

  OpenAddEmpleado(): void {
    this.dialogRefModal.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'agregado',
        TituloModal: 'Empleado',
        Link: '/list-empleado'
      }
    });
    
  }

  OpenEditEmpleado(): void {
    this.dialogRefModal.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'actualizado',
        TituloModal: 'Empleado',
        Link: '/list-empleado'
      }
    });
    
  }

}
