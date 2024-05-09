import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DatosDetalleFactura } from 'src/app/interfaces/factura';
import { Producto } from 'src/app/interfaces/producto';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-add-productofactura',
  templateUrl: './add-productofactura.component.html',
  styleUrls: ['./add-productofactura.component.scss']
})
export class AddProductofacturaComponent {


  busquedarealizada: boolean = false
  NOMBRE: string = '';
  cantidades: number[] = []; 
  product_result: Producto[] = [];
  productsbyname: Producto[] = [];
  Detallefactura: DatosDetalleFactura[] = [];
  productosFactura: DatosDetalleFactura[] = []; //

  constructor(private ref: MatDialogRef<AddProductofacturaComponent>,
    private _ProductService: ApiService,
    private _FacturaService: ApiService
  ){

  }

  ngOnInit(): void{
    this.MostrarAllProductos();
    this.MostrarUltimaFactura();
  }

  async MostrarUltimaFactura() {
    try {
        const numfactura = await this._FacturaService.getUltimaFactura().toPromise();
        if (numfactura) {
            this.Detallefactura = numfactura;
            console.log(numfactura);
        } else {
            console.error("El valor devuelto por el servicio es undefined.");
        }
    } catch (error) {
        console.error("Error al obtener la última factura:", error);
    }
}



  MostrarAllProductos(){
    this._ProductService.getAllProducts().subscribe(product_result =>{
      this.product_result = product_result;
      this.cantidades = new Array(product_result.length).fill(undefined);
      console.log(product_result);
    })
  }

  async agregarProducto(producto: Producto, cantidad: number) {
    if (cantidad && cantidad > 0) {
      // Obtener el mínimo entre la cantidad y el stock del producto
      const cantidadMaxima = Math.min(cantidad, producto.Stock);
  
      const productoFactura: DatosDetalleFactura = {
        NUMEROFACTURA: this.Detallefactura ? this.Detallefactura[0].NUMEROFACTURA : 0,
        IDPRODUCTO: producto.IDPRODUCTO,
        Cantidad: cantidadMaxima, // Usar la cantidad máxima
        PrecioUnitario: producto.PRECIO
      };
  
      try {
        await this._FacturaService.CrearDetalleFactura(productoFactura).toPromise();
        console.log('Factura creada');
      } catch (error) {
        console.error('Error al crear factura:', error);
      }
    }
  }
  

  BuscarProductobyName(){
    this._ProductService.getAllProductsbyName(this.NOMBRE).subscribe((producto: Producto[])=>{
      this.productsbyname = producto;
      this.cantidades = new Array(this.productsbyname.length).fill(undefined);
      this.busquedarealizada = true
    })
  }

  limitarCantidad(event: any, stock: number) {
    const input = event.target;
    const valor = input.valueAsNumber;
  
    // Si el valor ingresado supera el stock, establecer el valor del input al stock máximo
    if (valor > stock) {
      input.value = stock.toString();
    }
  }
  

}
