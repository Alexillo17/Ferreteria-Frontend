import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/interfaces/cliente';
import { Producto, Root } from 'src/app/interfaces/producto';
import { ApiService } from 'src/app/service/api.service';
import { AddProductofacturaComponent } from '../add-productofactura/add-productofactura.component';
import { Empleado } from 'src/app/interfaces/empleado';
import { DatosFactura } from 'src/app/interfaces/factura';

@Component({
  selector: 'app-crear-factura',
  templateUrl: './crear-factura.component.html',
  styleUrls: ['./crear-factura.component.scss']
})
export class CrearFacturaComponent {

  camposLlenos: boolean = false;
  MostrarCrearFactura: boolean = true;
  Camposseteados: boolean = false

  DatosCliente: any
  dataSource = new MatTableDataSource<Producto>();
  product_result: Root | undefined;
  fechaActual: Date;
  CEDULA: string = '';
  NOMBRE: string = ''
  APELLIDO: string = ''

  empleado_result: Empleado[] = []

  Empleado: any

  @ViewChild(MatPaginator) paginator!: MatPaginator;

constructor(
  private _ProductService: ApiService,
  private _ClienteService: ApiService,
  private _EmpleadoService:ApiService,
  private _FacturaService: ApiService,
  private dialogRef: MatDialog,
)
{
  this.fechaActual = new Date();    
}

ngOnInit(): void {
  this.MostrarProductos(1, 5);
  this.MostrarEmpleado();
}

ngAfterViewInit(): void {
 
}

MostrarEmpleado(){
  this._EmpleadoService.getEmpleados().subscribe(empleado_result =>{
    this.empleado_result = empleado_result
    console.log(empleado_result);
  })
}


CrearFactura(){
  const idempleado = this.Empleado
  const fecha = this.fechaActual.toLocaleDateString();


  const factura: DatosFactura = {
    IDEMPLEADO: idempleado,
    Fecha: fecha,
    IDCLIENTE: this.DatosCliente.idCliente
  }

  const jsonProduct = JSON.stringify(factura);

  console.log(jsonProduct)

  this._FacturaService.CrearFactura(factura).subscribe(()=>{
    console.log('Factura Creada')
  })

  this.MostrarCrearFactura = false;

  this.OpenAddProductFactura();
  debugger

}


MostrarProductos(pageNumber: number, pageSize: number): void {
  this._ProductService.getProducts(pageNumber, pageSize).subscribe((result: Root) => {
    this.product_result = result;
    this.dataSource.data = result.products;
  });
}


ObtenerClienteporCedula(): void {
  this._ClienteService.getClientebyCedula(this.CEDULA).subscribe((cliente: Cliente) =>{
    this.DatosCliente = cliente;
    console.log("Datos del cliente:", this.DatosCliente);
    this.NOMBRE = this.DatosCliente.Nombre;
    this.APELLIDO = this.DatosCliente.Apellido;
    const IDCLIENTE = this.DatosCliente.idCliente

  this.Camposseteados = true


    console.log(IDCLIENTE)
  })
}
OpenAddProductFactura(){
  this.dialogRef.open(AddProductofacturaComponent,{
    disableClose: true
  });
  
}

verificarCampos(): void {
  this.camposLlenos = !!this.CEDULA && !!this.NOMBRE && !!this.Empleado;
}


}
