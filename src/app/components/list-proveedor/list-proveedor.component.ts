import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { AddEditProveedorComponent } from '../add-edit-proveedor/add-edit-proveedor.component';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';
import { ProveedorService } from 'src/app/service/proveedor.service';

@Component({
  selector: 'app-list-proveedor',
  templateUrl: './list-proveedor.component.html',
  styleUrls: ['./list-proveedor.component.scss']
})
export class ListProveedorComponent {

  proveedor_result: Proveedor[] = []
  proveedorDis_result: Proveedor[] = []

  checkbox: boolean = false


  constructor(private _ProveedorService: ProveedorService,
    private dialogRef: MatDialog
  ){

  }

  ngOnInit(): void{

this.MostrarProveedor();
  }

  OpenAddProveedor(){
    this.dialogRef.open(AddEditProveedorComponent

    ).afterClosed().subscribe(() =>{
      this.MostrarProveedor();
    });
  }

MostrarAllProveedor(){
  this._ProveedorService.getProveedorInactivos().subscribe(proveedorDis_result =>{
    this.proveedorDis_result = proveedorDis_result
    this.checkbox = true
    console.log(proveedorDis_result);
  })
}

toggleProveedorList() {
  if (this.checkbox) {
    this.MostrarAllProveedor();
  } else {
    this.MostrarProveedor();
  }
}

  MostrarProveedor(){
    this._ProveedorService.getProveedor().subscribe(proveedor_result =>{
      this.proveedor_result = proveedor_result
      console.log(proveedor_result);
    })
  }

  OpenEditProveedor(IDPROVEEDOR?: number): void{
    if(IDPROVEEDOR !== undefined && IDPROVEEDOR !== null){
      this.dialogRef.open(AddEditProveedorComponent,{
        data: {IDPROVEEDOR: IDPROVEEDOR}
      }).afterClosed().subscribe(()=>{
        if(this.checkbox){
          this.MostrarAllProveedor();
        }
        else{
          this.MostrarProveedor();
        }  
      })
    }
    else{
      IDPROVEEDOR = 0;
      this.OpenAddProveedor();
    }
    debugger
  }

  DeleteProveedor(proveedor: Proveedor): void {
    if (proveedor !== undefined && proveedor !== null) {
      this._ProveedorService.deleteProveedor(proveedor.IDPROVEEDOR, proveedor).subscribe(() => {
        console.log('Proveedor Eliminado');
        this.OpenDeleteProveedor();
      });
    }
  }

  OpenDeleteProveedor(): void {
    this.dialogRef.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'dado de baja',
        TituloModal: 'Proveedor',
      }
    }).afterClosed().subscribe(()=>{
      this.MostrarProveedor();
    });
    
  }
}
