import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Factura, FacturaRoot } from 'src/app/interfaces/factura';
import { ApiService } from 'src/app/service/api.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-factura',
  templateUrl: './list-factura.component.html',
  styleUrls: ['./list-factura.component.scss']
})
export class ListFacturaComponent {

  factura_result: FacturaRoot | undefined
  dataSource = new MatTableDataSource<Factura>();
  granTotal: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _FacturaService: ApiService,
  ){

  }

  ngOnInit(): void{
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => this.MostrarFactura(this.paginator.pageIndex + 1, this.paginator.pageSize));
    this.MostrarFactura(1, 10);
  }

  MostrarFactura(pageNumber: number, pageSize: number): void{
   this._FacturaService.getFactura(pageNumber,pageSize).subscribe((result: FacturaRoot) =>{
    this.factura_result = result;
    this.dataSource.data = result.facturas
   })
  
     
  }

}
