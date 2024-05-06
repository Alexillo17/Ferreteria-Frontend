import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from 'src/app/interfaces/cliente';

import { ApiService } from 'src/app/service/api.service';
import { AddEditClienteComponent } from '../add-edit-cliente/add-edit-cliente.component';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';

@Component({
  selector: 'app-list-cliente',
  templateUrl: './list-cliente.component.html',
  styleUrls: ['./list-cliente.component.scss']
})
export class ListClienteComponent {

  cliente_result: Cliente[] = [];
  cliente_resultDis: Cliente[] = [];
  clientesbyname: Cliente[] = []
  busquedarealizada: boolean = false
  filtro: string = '';
  Nombre: string = ''
  checkbox: boolean = false

  constructor(
    private _ClienteService: ApiService,
    private dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    this.MostrarClientes();
  }

  MostrarClientes() {
    this._ClienteService.getClientes().subscribe(clientes => {
      this.cliente_result = clientes;
      console.log(clientes)
    });
  }

  MostrarClientesInactivos() {
    this._ClienteService.getClientesInactivos().subscribe(clientes => {
      this.cliente_resultDis = clientes;
      debugger
    });
  }

  toggleClienteList() {
    if (this.checkbox) {
      this.MostrarClientesInactivos();
    } else {
      this.MostrarClientes();
    }
  }
  
  BuscarClientebyName(){
    if(this.Nombre === ''){
      this.busquedarealizada = false
    }
    else{
      if (this.checkbox) {
        this._ClienteService.getclientesInactivosbyname(this.Nombre).subscribe((cliente: Cliente[])=>{
          this.clientesbyname = cliente;
          this.busquedarealizada = true
        })
      } else {
   this._ClienteService.getclientesbyname(this.Nombre).subscribe((cliente: Cliente[])=>{
      this.clientesbyname = cliente;
      this.busquedarealizada = true
    })
      }
   
    }
  }


  OpenEditCliente(IDCLIENTE?: number): void {
    if (IDCLIENTE !== undefined && IDCLIENTE !== null) {
      this.dialogRef.open(AddEditClienteComponent, {
        data: { IDCLIENTE: IDCLIENTE }
      }).afterClosed().subscribe(() => {
        if (this.checkbox) {
          this.MostrarClientesInactivos();
        } else {
          this.MostrarClientes();
        }
      });
    }
  }

  OpenAddCliente() {
    this.dialogRef.open(AddEditClienteComponent).afterClosed().subscribe(() => {
      if (this.checkbox) {
        this.MostrarClientesInactivos();
      } else {
        this.MostrarClientes();
      }
    });
  }

  DeleteCliente(cliente: Cliente): void {
    if(cliente.Estado === 'Inactivo'){
      return;
    }
    else{
      if (cliente !== undefined && cliente !== null && cliente.IDCLIENTE !== undefined && cliente.IDCLIENTE !== null) {
      this._ClienteService.deletecliente(cliente.IDCLIENTE, cliente).subscribe(() => {
        console.log('Cliente Eliminado');
        this.OpenDeleteCliente();
      });
      debugger
    }
    }
  }

  OpenDeleteCliente(): void {
    this.dialogRef.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'dado de baja',
        TituloModal: 'Cliente',
      }
    }).afterClosed().subscribe(()=>{
      if (this.checkbox) {
        this.MostrarClientesInactivos();
      } else {
        this.MostrarClientes();
      }
    });
    
  }
  
}
