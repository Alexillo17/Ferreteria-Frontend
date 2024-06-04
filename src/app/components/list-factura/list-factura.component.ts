import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Factura, FacturaRoot } from 'src/app/interfaces/factura';
import { ApiService } from 'src/app/service/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DetalleFacturaComponent } from '../detalle-factura/detalle-factura.component';

@Component({
  selector: 'app-list-factura',
  templateUrl: './list-factura.component.html',
  styleUrls: ['./list-factura.component.scss']
})
export class ListFacturaComponent {

  factura_result: FacturaRoot | undefined
  dataSource = new MatTableDataSource<Factura>();
  totalFacturas: number = 0;
  granTotal: number = 0;
  FechaInicio: string = ''
  FechaFinal: string =  ''
  busquedarealizada: boolean =  false
  facturabydate: FacturaRoot | undefined

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _FacturaService: ApiService,
    private dialogRef: MatDialog
  ){

  }

  ngOnInit(): void{
  }



  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => this.MostrarFactura(this.paginator.pageIndex + 1, this.paginator.pageSize));
    this.MostrarFactura(1, 5);
  }

  camposRellenos: boolean = false;

  checkInputs() {
    this.camposRellenos = !!(this.FechaInicio && this.FechaFinal);
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    // Formatear la fecha actual en el formato YYYY-MM-DD requerido por el input type="date"
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  

  MostrarFactura(pageNumber: number, pageSize: number): void{
   this._FacturaService.getFactura(pageNumber,pageSize).subscribe((result: FacturaRoot) =>{
    this.factura_result = result;
    this.dataSource.data = result.facturas
    debugger
   })
  
  }

  OpenDetalleFactura(NumeroFactura?: number): void{
    this.dialogRef.open(DetalleFacturaComponent,{
       data: {NumeroFactura: NumeroFactura}
    })
   debugger
  }

  ReporteFacturabyDate(pageNumber: number, pageSize: number) {
    // Verificamos si las fechas son válidas
    if (this.FechaInicio && this.FechaFinal) {
      this._FacturaService.getFacturabyDate( this.FechaInicio, this.FechaFinal, pageNumber, pageSize).subscribe((factura: FacturaRoot) =>{
        this.facturabydate = factura
        this.busquedarealizada = true
        this.dataSource.data = factura.facturas
        this.paginator.length = factura.totalFacturas;
      });
    } else {
      console.error("Las fechas ingresadas no son válidas.");
    }
  }

}
