import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Factura } from 'src/app/interfaces/factura';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.scss']
})
export class DetalleFacturaComponent {

  TotalSum: number
  factura_resultbyID: any;
  NumeroFactura: number
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<DetalleFacturaComponent>,
    private _FacturaService: ApiService
    ){

      this.TotalSum = 0
      this.NumeroFactura = data.NumeroFactura
    
  }

  ngOnInit(): void{
    this.MostrarFacturaporID(this.NumeroFactura)
    debugger

  }

  MostrarFacturaporID(NumeroFactura: number){
this._FacturaService.getFacturabyID(NumeroFactura).subscribe((factura_result: Factura) =>{
  this.factura_resultbyID = factura_result;
  console.log(this.factura_resultbyID)

   this.TotalSum = 0

   for(let i = 0; i < this.factura_resultbyID.length; i++){
    this.TotalSum += this.factura_resultbyID[i].Total;
   }

   console.log("Total sumado:", this.TotalSum);
  
  debugger
})
  }

}
