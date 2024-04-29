import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Empleado } from 'src/app/interfaces/empleado';
import { ApiService } from 'src/app/service/api.service';
import { AddEditEmpleadoComponent } from '../add-edit-empleado/add-edit-empleado.component';

@Component({
  selector: 'app-list-empleado',
  templateUrl: './list-empleado.component.html',
  styleUrls: ['./list-empleado.component.scss']
})
export class ListEmpleadoComponent {

  empleado_result: Empleado[] = []

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

  OpenEditAddEmpleado(){
    this.dialogRef.open(AddEditEmpleadoComponent)
  }    

  OpenEditEmpleado(IDEMPLEADO?: number): void {
    if (IDEMPLEADO !== null) {
      this.dialogRef.open(AddEditEmpleadoComponent, {
        data: { IDEMPLEADO: IDEMPLEADO }
      })
    } else {
      IDEMPLEADO = 0;
      this.OpenEditAddEmpleado();
    }
  debugger
  }

  OpenAddEmpleado(){
    this.dialogRef.open(AddEditEmpleadoComponent)
  }
    

}
