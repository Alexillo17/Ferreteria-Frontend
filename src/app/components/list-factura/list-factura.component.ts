import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Factura, FacturaRoot } from 'src/app/interfaces/factura';
import { ApiService } from 'src/app/service/api.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DetalleFacturaComponent } from '../detalle-factura/detalle-factura.component';
import jsPDF from 'jspdf';

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
  facturabydatePDF: FacturaRoot | undefined


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

  
    const fechaInicio = this.FechaInicio
    const fechaFin = this.FechaFinal

      debugger
  
      this._FacturaService.getFacturabyDate(fechaInicio, fechaFin, pageNumber, pageSize)
        .subscribe((factura: FacturaRoot) => {
          this.facturabydate = factura;
          this.busquedarealizada = true;
          this.dataSource.data = factura.facturas;
          this.paginator.length = factura.totalFacturas;
        });

        this.loadfacturasbydate();
   
  }

  onPageChange(event: PageEvent) {
    if (this.busquedarealizada) {
      this.ReporteFacturabyDate(event.pageIndex + 1, event.pageSize);
    }
  }

  loadfacturasbydate(){

    const fechaInicio = this.FechaInicio;
    const fechaFin = this.FechaFinal;
    this._FacturaService.getFacturabyDatePDF(fechaInicio, fechaFin)
        .subscribe((facturaPDF: FacturaRoot) => {
          this.facturabydatePDF = facturaPDF;
        });
  }

 generatePDFFacturasByDate(): void {
  if (!this.facturabydatePDF || !this.facturabydatePDF.facturas || this.facturabydatePDF.facturas.length === 0) {
    console.log('No hay facturas para generar el PDF');
    return; 
  }

  const doc = new jsPDF();
  

  const title = 'Listado de Facturas por Fecha';
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleWidth = doc.getTextWidth(title);
  const titleX = (pageWidth - titleWidth) / 2; 
  doc.setFontSize(14); 
  doc.text(title, titleX, 20); 
  
  const head = [['Número Factura', 'Cliente', 'Empleado', 'Fecha', 'Total']];

  const body = this.facturabydatePDF.facturas.map(factura => [
    factura.NumeroFactura,
    factura.Cliente,
    factura.Empleado,
    factura.Fecha,
    `C$${factura.Total}`
  ]);
  

  (doc as any).autoTable({
    head: head,
    body: body,
    startY: 30 
  });
  
  const fileName = `Facturas desde ${this.FechaInicio} hasta ${this.FechaFinal}.pdf`;
  doc.save(fileName);
}


 

}
