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
    this._ClienteService.getclientesbyname(this.Nombre).subscribe((cliente: Cliente[])=>{
      this.clientesbyname = cliente;
      this.busquedarealizada = true
    })
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

}
