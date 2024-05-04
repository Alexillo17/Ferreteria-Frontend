import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/interfaces/cliente';
import { Producto, Root } from 'src/app/interfaces/producto';
import { ApiService } from 'src/app/service/api.service';
import { AddProductofacturaComponent } from '../add-productofactura/add-productofactura.component';
import { Empleado } from 'src/app/interfaces/empleado';
import { DatosDetalleFactura, DatosFactura, Factura } from 'src/app/interfaces/factura';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-factura',
  templateUrl: './crear-factura.component.html',
  styleUrls: ['./crear-factura.component.scss']
})
export class CrearFacturaComponent {

  form: FormGroup;

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
  factura_resultbyID: any;
  TotalSum: number = 0
  NumeroFactura: number = 0
  Detallefactura: DatosDetalleFactura[] = [];

 

  @ViewChild(MatPaginator) paginator!: MatPaginator;

constructor(
  private _ProductService: ApiService,
  private _ClienteService: ApiService,
  private _EmpleadoService:ApiService,
  private _FacturaService: ApiService,
  private dialogRef: MatDialog,
  private fb: FormBuilder
)
{
  this.form = this.fb.group({
    Cedula: ['', [Validators.required, this.validarFormatoCedula]]
  });
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

Crearcliente(){
  if(this.CEDULA == '' || this.APELLIDO == '' || this.NOMBRE == ''){
    debugger;
    return
  }
  else{
    const cliente: Cliente = {
      Nombre:  this.NOMBRE,
      Apellido: this.APELLIDO,
      Cedula: this.CEDULA
  
    }
  
    const jsonCliente = JSON.stringify(cliente);
  
    this._ClienteService.saveCliente(cliente).subscribe(() => {
        this.DatosCliente = cliente;  
    })
    this.ObtenerClienteporCedula();
    debugger
  
  }
 
}


CrearFactura(){
  const idempleado = this.Empleado
  const fecha = this.fechaActual.toLocaleDateString();


     //Si no pos se busca y ya
    const factura: DatosFactura = {
      IDEMPLEADO: idempleado,
      Fecha: fecha,
      IDCLIENTE: this.DatosCliente.IDCLIENTE
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
    if(this.DatosCliente !== null){
      this.Camposseteados = true
      this.NOMBRE = this.DatosCliente.Nombre;
    this.APELLIDO = this.DatosCliente.Apellido;
    const IDCLIENTE = this.DatosCliente.IDCLIENTE
    }
    else{
       this.Camposseteados = false
       console.log('no hay')
       this.NOMBRE = ''
       this.APELLIDO = ''
       this.Empleado = ''
    }


  })
}

OpenAddProductFactura(){
  this.dialogRef.open(AddProductofacturaComponent,{
    disableClose: true
  }
).afterClosed().subscribe(()=>{
  this.MostrarUltimaFactura();
});
}

verificarCampos(): void {
  this.camposLlenos = !!this.CEDULA && !!this.NOMBRE && !!this.Empleado;
}

async MostrarUltimaFactura() {
  try {
    const numFactura = await this._FacturaService.getUltimaFactura().toPromise();
    
    if (numFactura) {
      this.Detallefactura = numFactura;

      console.log('Última factura:', this.Detallefactura);
      debugger
      this.MostrarProductosAgregados();
    } else {
      console.error('La última factura es undefined');
    }
  } catch (error) {
    console.error('Error al obtener la última factura:', error);
  }

}



  MostrarProductosAgregados(){
  this._FacturaService.getFacturabyID(this.Detallefactura[0].NUMEROFACTURA).subscribe((factura_result: Factura) =>{
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

EliminarProducto(NumeroFactura: number, IdProducto: number){
  this._FacturaService.DeleteProductodeFactura(NumeroFactura, IdProducto).subscribe(
    ()=>{
      this._FacturaService.getFacturabyID(this.Detallefactura[0].NUMEROFACTURA).subscribe((factura_result: Factura) =>{
        this.factura_resultbyID = factura_result;
        console.log(this.factura_resultbyID)
      debugger
         this.TotalSum = 0
      
         for(let i = 0; i < this.factura_resultbyID.length; i++){
          this.TotalSum += this.factura_resultbyID[i].Total;
         }
      
         console.log("Total sumado:", this.TotalSum);
        
        debugger
      })
    }
  )
}

validarFormatoCedula(control: FormControl): { [key: string]: boolean } | null {
  const cedula = control.value;
  if (!cedula || !/^[0-9]{3}-[0-9]{6}-[0-9]{4}[A-Z]$/i.test(cedula)) {
    return { 'cedulaInvalida': true };
  }
  return null;
}
}

