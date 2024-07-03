import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DatosDetalleFactura } from 'src/app/interfaces/factura';
import { Producto, ProductoRegistrado } from 'src/app/interfaces/producto';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ApiService } from 'src/app/service/api.service';
import { ProveedorService } from 'src/app/service/proveedor.service';

@Component({
  selector: 'app-add-existenciaproduct',
  templateUrl: './add-existenciaproduct.component.html',
  styleUrls: ['./add-existenciaproduct.component.scss']
})
export class AddExistenciaproductComponent {
  productosSeleccionados: { producto: Producto, cantidad: number }[] = [];

  busquedarealizada: boolean = false
  busquedarealizadaproveedor: boolean = false
  NOMBRE: string = '' ;
  fechaActual: Date;
  idProveedorSeleccionado: number;
  cantidades: number[] = []; 
  product_result: Producto[] = [];
  productsbyname: Producto[] = [];
  productsbyproveedor: Producto[] = [];
  Detallefactura: DatosDetalleFactura[] = [];
  productosFactura: DatosDetalleFactura[] = []; //
  proveedor_result: Proveedor[] = [];

  constructor(private ref: MatDialogRef<AddExistenciaproductComponent>,
    private _ProductService: ApiService,
    private _FacturaService: ApiService,
    private _ProveedorService: ProveedorService,
  ){
this.idProveedorSeleccionado = 0
this.fechaActual = new Date();    
  }

  ngOnInit(): void{
    this.MostrarAllProductos();
    this.MostrarProveedor();
  }


  MostrarAllProductos(){
    this._ProductService.getAllInsercionesProducts().subscribe(product_result =>{
      this.product_result = product_result;
      this.cantidades = new Array(product_result.length).fill(undefined);
      console.log(product_result);
    })
  }

  MostrarProveedor() {
    this._ProveedorService.getProveedor().subscribe(proveedor_result => {
      this.proveedor_result = proveedor_result;
      console.log(proveedor_result);
    });
  }

  async agregarProducto(producto: Producto, cantidad: number) {
    if (cantidad && cantidad > 0) {
        // Obtener el mínimo entre la cantidad y el stock del producto
        const cantidadMaxima = Math.min(cantidad, producto.Stock);

        // Agregar el producto a la lista de productos seleccionados
        this.productosSeleccionados.push({ producto, cantidad: cantidadMaxima });

        console.log('Producto agregado:', producto.NOMBRE, 'Cantidad:', cantidadMaxima);
    }
}

async agregarProductosSeleccionados() {
  try {
    for (let i = 0; i < this.cantidades.length; i++) {
      const cantidad = this.cantidades[i];
      const producto = this.busquedarealizada ? this.productsbyname[i] : this.product_result[i]

      const fechaActual = new Date(this.fechaActual); // Suponiendo que this.fechaActual es un objeto Date

      // Obtener los componentes de la fecha
      const year = fechaActual.getUTCFullYear();
      const month = (fechaActual.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = fechaActual.getUTCDate().toString().padStart(2, '0');
    
      // Formatear la fecha a mm/dd/yyyy
      const fecha = `${month}/${day}/${year}`;
      
      if (cantidad && cantidad > 0) {
        
        const productoRegistro: ProductoRegistrado = {
          idProducto: producto.IDPRODUCTO,
          Cantidad: cantidad,
          Fecha: fecha
        };
        
        await this._ProductService.saveregistroProducts(productoRegistro).toPromise();
        
        console.log('Producto agregado a la factura:', producto.NOMBRE);
      }
    }
    
    console.log('Productos agregados a la factura correctamente');
    this.ref.close(); // Cerrar el diálogo después de agregar los productos
  } catch (error) {
    console.error('Error al agregar productos a la factura:', error);
  }
}

cantidadesValidas(): boolean {
  return this.cantidades.some(cantidad => cantidad && cantidad > 0);
}

BuscarProductobyProveedor() { 
  this._ProductService.getproductbyproveedor(this.idProveedorSeleccionado ).subscribe((productos: Producto[]) => {
    this.productsbyproveedor = productos;
    this.cantidades = new Array(this.productsbyname.length).fill(undefined);
    this.busquedarealizadaproveedor = true;
    console.log(productos)
  });
}

BuscarProductobyName() {
  if(this.NOMBRE == ''){
    this.busquedarealizada = false
    return;
  }
  else{
    let nombreParametro = this.NOMBRE ? this.NOMBRE : 'null'; 
    console.log(this.idProveedorSeleccionado, nombreParametro)
    this._ProductService.getproductbynameproveedor(nombreParametro, this.idProveedorSeleccionado ).subscribe((productos: Producto[]) => {
      this.productsbyname = productos;
      this.cantidades = new Array(this.productsbyname.length).fill(undefined);
      this.busquedarealizadaproveedor = false;
      this.busquedarealizada = true;
      console.log(productos)
    });
  }
 
}

getEstadoClass(estado: string): string {
  return estado === 'Agotado' ? 'inactivo' : '';
}

  limitarCantidad(event: any, stock: number) {
 
  }
}
