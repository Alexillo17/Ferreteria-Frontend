import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Empleado } from 'src/app/interfaces/empleado';
import { ApiService } from 'src/app/service/api.service';
import { AddEditEmpleadoComponent } from '../add-edit-empleado/add-edit-empleado.component';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';

@Component({
  selector: 'app-list-empleado',
  templateUrl: './list-empleado.component.html',
  styleUrls: ['./list-empleado.component.scss']
})
export class ListEmpleadoComponent {

  empleado_result: Empleado[] = []
  checkbox: boolean = false

  constructor( private _EmpleadoService: ApiService,
    private dialogRef: MatDialog
  ){
    
  }

  ngOnInit(): void{

  this.MostrarEmpleado();
      }

      MostrarEmpleado(){
        this._EmpleadoService.getEmpleados().subscribe(empleado_result =>{
          this.empleado_result = empleado_result
          console.log(empleado_result);
        })
      }

      MostrarEmpleadoInactivos(){
        this._EmpleadoService.getEmpleadosInactivos().subscribe(empleado_result =>{
          this.empleado_result = empleado_result
          console.log(empleado_result);
        })
      }

      toggleClienteList() {
        if (this.checkbox) {
          this.MostrarEmpleadoInactivos();
        } else {
         this.MostrarEmpleado();
        }
      }

  OpenEditAddEmpleado(){
    this.dialogRef.open(AddEditEmpleadoComponent)
  }    

  OpenEditEmpleado(IDEMPLEADO?: number): void {
    if (IDEMPLEADO !== null) {
      this.dialogRef.open(AddEditEmpleadoComponent, {
        disableClose: true,
        data: { IDEMPLEADO: IDEMPLEADO }
      }).afterClosed().subscribe(()=>{
        debugger;
        if (this.checkbox) {
          this.MostrarEmpleadoInactivos();
        } else {
          this.MostrarEmpleado();
        }
      })
    } else {
      IDEMPLEADO = 0;
      this.OpenEditAddEmpleado();
    }
  debugger;
  }

  OpenAddEmpleado(){
    this.dialogRef.open(AddEditEmpleadoComponent,{
      disableClose: true
    }).afterClosed().subscribe(()=>{
      if (this.checkbox) {
        this.MostrarEmpleadoInactivos();
      } else {
        this.MostrarEmpleado();
      }
    })
  }

  DeleteCliente(empleado: Empleado): void {
    if(empleado.Estado === 'Inactivo'){
      return;
    }
    else{
      if (empleado !== undefined && empleado !== null && empleado.IDEMPLEADO !== undefined && empleado.IDEMPLEADO !== null) {
      this._EmpleadoService.deleteEmpleado(empleado.IDEMPLEADO, empleado).subscribe(() => {
        console.log('Empleado Eliminado');
        this.OpenDeleteEmpleado();
      });
      debugger
    }
    }
  }

  OpenDeleteEmpleado(): void {
    this.dialogRef.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'dado de baja',
        TituloModal: 'Empleado',
      }
    }).afterClosed().subscribe(()=>{
      if (this.checkbox) {
        this.MostrarEmpleadoInactivos();
      } else {
        this.MostrarEmpleado();
      }
    });
    
  }
    

}
