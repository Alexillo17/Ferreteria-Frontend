import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  idExistente: boolean = false;
  cedulaExistente: boolean = false; 


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _EmpleadoService: ApiService,
    private dialogRefModal: MatDialog,
    private dialogRef: MatDialogRef<AddEditEmpleadoComponent>,
  ){
    this.form = this.fb.group({
      Codigo: ['', [Validators.required], [this.validarIdExistente.bind(this)]],
      Nombre: ['',Validators.required],
      Apellido: ['',Validators.required],
      Telefono: ['',Validators.required],
      Cedula: ['', [Validators.required], [this.validarCedula.bind(this)]],
      Estado: ['',Validators.required]
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

  validarCedula(control: AbstractControl): Promise<ValidationErrors | null> {
    const cedula = control.value;
    if (!cedula) {
      return Promise.resolve(null);
    }
    return new Promise((resolve, reject) => {
      const cedulaValida = /^[0-9]{3}-[0-9]{6}-[0-9]{4}[A-Z]$/.test(cedula);
      if (!cedulaValida) {
        resolve({ cedulaInvalida: true });
      } else {
        this._EmpleadoService.getEmpleadobyCedula(cedula).subscribe((empleado: Empleado) => {
          if (empleado && empleado.IDEMPLEADO !== this.IDEMPLEADO) {
            this.cedulaExistente = true;
            resolve({ cedulaExistente: true });
          } else {
            this.cedulaExistente = false;
            resolve(null);
          }
        }, (error) => {
          console.error("Error al buscar proveedor por cédula", error);
          reject({ cedulaInvalida: true });
        });
      }
    });
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
        Estado: this.editdata.Estado
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
    const estado = this.form.value.Estado

    if(!idempleado || !nombre || !telefono || !cedula){
      console.error('Relleno los campos')
      return;
    }

     const empleado: Empleado ={
      IDEMPLEADO: idempleado,
      Nombre: nombre,
      Apellido: apellido,
      Telefono: telefono,
      Cedula: cedula,
      Estado: estado
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
      }
    }).afterClosed().subscribe(()=>{
      this.CloseEmpleado();
    });
    
  }

  OpenEditEmpleado(): void {
    this.dialogRefModal.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'actualizado',
        TituloModal: 'Empleado',
      }
    }).afterClosed().subscribe(()=>{
      this.CloseEmpleado();
    });
    
  }

  CloseEmpleado(){
    this.dialogRef.close();
  }

  validarIdExistente(control: FormControl): Promise<ValidationErrors | null> {
    const id = control.value;
    if (!id) {
      return Promise.resolve(null);
    }
    return new Promise((resolve, reject) => {
      this._EmpleadoService.getEmpleadobyID(id).subscribe((empleado: Empleado) => {
        if (empleado && empleado.IDEMPLEADO !== this.IDEMPLEADO) {
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
