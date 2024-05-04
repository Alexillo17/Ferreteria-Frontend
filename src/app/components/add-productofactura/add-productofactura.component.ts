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

  MostrarUltimaFactura(){
    this._FacturaService.getUltimaFactura().subscribe(numfactura =>{
      this.Detallefactura = numfactura
      console.log(numfactura);
    })

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
      const productoFactura: DatosDetalleFactura = {
        NUMEROFACTURA: this.Detallefactura ? this.Detallefactura[0].NUMEROFACTURA : 0,
        IDPRODUCTO: producto.IDPRODUCTO,
        Cantidad: cantidad,
        PrecioUnitario: producto.PRECIO
      };
  
      try {
        await this._FacturaService.CrearDetalleFactura(productoFactura).toPromise();
        console.log('MALDITA FACTURA CREADA');
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

}
