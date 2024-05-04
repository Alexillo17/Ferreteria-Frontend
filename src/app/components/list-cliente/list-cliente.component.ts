import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from 'src/app/interfaces/cliente';

import { ApiService } from 'src/app/service/api.service';
import { AddEditClienteComponent } from '../add-edit-cliente/add-edit-cliente.component';

@Component({
  selector: 'app-list-cliente',
  templateUrl: './list-cliente.component.html',
  styleUrls: ['./list-cliente.component.scss']
})
export class ListClienteComponent {

  cliente_result: Cliente[] = []


  constructor(
    private _ClienteService:ApiService,
    private dialogRef: MatDialog
  ){

  }

  ngOnInit(): void{
 this.MostrarClientes();
      }

      MostrarClientes(){
        this._ClienteService.getClientes().subscribe(clientes =>{
          this.cliente_result = clientes
          console.log(clientes);
        })
      }


      OpenEditCliente(IDCLIENTE?: number): void{
        if(IDCLIENTE !== undefined && IDCLIENTE !== null){
          this.dialogRef.open(AddEditClienteComponent,{
            data: {IDCLIENTE: IDCLIENTE}
          }).afterClosed().subscribe(()=>{
            this.MostrarClientes();
          })
        }
      }

      OpenAddCliente(){
        this.dialogRef.open(AddEditClienteComponent).afterClosed().subscribe(()=>
        {
          this.MostrarClientes();
        })
      }

}
