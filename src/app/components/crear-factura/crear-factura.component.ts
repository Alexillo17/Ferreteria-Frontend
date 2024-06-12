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
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';
import { Router } from '@angular/router';
import { ModalAlertComponent } from '../modal-alert/modal-alert.component';

@Component({
  selector: 'app-crear-factura',
  templateUrl: './crear-factura.component.html',
  styleUrls: ['./crear-factura.component.scss']
})
export class CrearFacturaComponent {

  camposLlenos: boolean = false;
  MostrarCrearFactura: boolean = true;
  Camposseteados: boolean = false

  cliente_existe: boolean = false
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
  private fb: FormBuilder,
  private router: Router
)
{
 
  this.fechaActual = new Date();    
}

ngOnInit(): void {
  console.log(this.factura_resultbyID)
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

Crearcliente() {
  // Verifica si los campos necesarios están llenos
  if (this.CEDULA == '' || this.APELLIDO == '' || this.NOMBRE == '') {
    // Si alguno de los campos está vacío, muestra un mensaje de error
    console.error("Por favor complete todos los campos.");
    return;
  } else {
    // Realiza una consulta para verificar si el cliente ya existe
    this._ClienteService.getClientebyCedula(this.CEDULA).subscribe((cliente: Cliente) => {
      if (cliente) {
        console.error("La cédula ya está registrada.");
      } else {
        // Si el cliente no existe, crea un nuevo cliente
        const nuevoCliente: Cliente = {
          Nombre: this.NOMBRE,
          Apellido: this.APELLIDO,
          Cedula: this.CEDULA,
          Estado: 'Activo'
        };

        // Guarda el nuevo cliente
        this._ClienteService.saveCliente(nuevoCliente).subscribe(() => {
          // Si se guarda exitosamente, actualiza los datos del cliente
          this.DatosCliente = nuevoCliente;
          // Abre la ventana/modal para agregar cliente (si es necesario)
          this.OpenAddCliente();
        });
      }
    });
  }
}



async CrearFactura() {
  const idempleado = this.Empleado;

  // Obtener la fecha actual y formatearla a mm/dd/yyyy
  const fechaActual = new Date(this.fechaActual); // Suponiendo que this.fechaActual es un objeto Date
  const fecha = (fechaActual.getMonth() + 1).toString().padStart(2, '0') + '/' +
                fechaActual.getDate().toString().padStart(2, '0') + '/' +
                fechaActual.getFullYear();

  const factura = {
    IDEMPLEADO: idempleado,
    Fecha: fecha,
    IDCLIENTE: this.DatosCliente.IDCLIENTE
  };

  debugger

  const jsonFactura = JSON.stringify(factura);

  console.log(jsonFactura);

  try {
    await this._FacturaService.CrearFactura(factura).toPromise();
    console.log('Factura Creada');
  } catch (error) {
    console.error('Error al crear la factura:', error);
  }

  this.MostrarCrearFactura = false;
  this.OpenAddProductFactura();
}



ObtenerClienteporCedula(): void {
  if (!this.CEDULA) {
    // Si la cédula está vacía, restablecer los campos y habilitar el botón
    this.Camposseteados = false;
    this.NOMBRE = '';
    this.APELLIDO = '';
    return;
  }

  this._ClienteService.getClientebyCedula(this.CEDULA).subscribe((cliente: Cliente) => {
    this.DatosCliente = cliente;
    console.log("Datos del cliente:", this.DatosCliente);
    if (this.DatosCliente !== null) {
      // Si el cliente existe, deshabilitar el botón de Crear Cliente
      this.Camposseteados = true;
      this.NOMBRE = this.DatosCliente.Nombre;
      this.APELLIDO = this.DatosCliente.Apellido;
    } else {
      // Si el cliente no existe, habilitar el botón de Crear Cliente
      this.Camposseteados = false;
      console.log('no hay');
      this.NOMBRE = '';
      this.APELLIDO = '';
    }
  });
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
  this.camposLlenos = !!this.CEDULA && !!this.NOMBRE;
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



async MostrarProductosAgregados() {
  try {
    const factura_result = await this._FacturaService.getFacturabyID(this.Detallefactura[0].NUMEROFACTURA).toPromise();
    
    this.factura_resultbyID = factura_result;
    console.log(this.factura_resultbyID);

    this.TotalSum = 0;

    for (let i = 0; i < this.factura_resultbyID.length; i++) {
      this.TotalSum += this.factura_resultbyID[i].Total;
    }

    console.log("Total sumado:", this.TotalSum);
    
    debugger; 

  } catch (error) {
    console.error("Error al obtener la factura:", error);
    
  }
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

validarFormatoCedula(): boolean {
  const cedula = this.CEDULA;
  if (!cedula || !/^[0-9]{3}-[0-9]{6}-[0-9]{4}[A-Z]$/i.test(cedula)) {
      return false;
  }
  return true;
}


TerminarFactura(){
  this.dialogRef.open(ModalCompletadoComponent, {
    data: {
      TituloModalAccion:  'creado',
      TituloModal: 'Factura',
    },
    disableClose: true
  }).afterClosed().subscribe(()=>{
    this.router.navigate(['/list-factura'])
  });
}


//Cancelar una factura y validado tanto si la factura ya fue creada o si no
CancelarFactura(): void {
  if (this.Detallefactura && this.Detallefactura.length > 0) {
    // Si hay productos en la factura, abrir el diálogo de confirmación
    this.dialogRef.open(ModalAlertComponent, {
      disableClose: true
    }).afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        const numeroFactura = this.Detallefactura[0].NUMEROFACTURA;
        this._FacturaService.DeleteFactura(numeroFactura).subscribe(() => {
        });
        this.router.navigate(['/list-factura']);
      } else {
        return;
      }
    });
  } else {
    // Si no hay productos en la factura, navegar directamente a la lista de facturas
    this.router.navigate(['/list-factura']);
  }
}


OpenAddCliente(): void {
  this.dialogRef.open(ModalCompletadoComponent, {
    data: {
      TituloModalAccion: 'agregado',
      TituloModal: 'Cliente',
    },
    disableClose: true
  }).afterClosed().subscribe(() => {
    this.ObtenerClienteporCedula();
  });
}



}

