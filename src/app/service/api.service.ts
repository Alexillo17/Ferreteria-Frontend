import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError } from 'rxjs';
import {Categoria, Producto, Root} from '../interfaces/producto'
import { Proveedor } from '../interfaces/proveedor';
import { DatosDetalleFactura, DatosFactura, Factura, FacturaRoot } from '../interfaces/factura';
import { Empleado } from '../interfaces/empleado';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private urlApi = 'http://localhost:3000/api/'


  constructor(private http: HttpClient) { }




  //Cliente API
  public getClientebyCedula(CEDULA: string):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlApi}${'cliente/'}${CEDULA}`)
  }
  

  //Category API

 public getCategory(): Observable<Categoria[]>{
    return this.http.get<Categoria[]>(this.urlApi + 'category')
  }

  //Product API
  public getProducts(pageNumber: number, pageSize: number): Observable<Root>{
    const URL = `${this.urlApi + 'products'}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<Root>(URL);
  }

  public getProductibyID(IDPRODUCTO: number):Observable<Producto>{
    return this.http.get<Producto>(`${this.urlApi}${'products/'}${IDPRODUCTO}`)
  }

   saveProducts(product: Producto): Observable<Producto>{
 return this.http.post<Producto>(this.urlApi +'createproducts',product).pipe(catchError
  (this.handleError)
 );
  }

  updateProducts(IDPRODUCTO: number,product: Producto): Observable<Producto>{
    return this.http.put<Producto>(`${this.urlApi}${'updateproduct/'}${IDPRODUCTO}`,product)
  }

  getproductbyname(pageNumber: number, pageSize: number, NOMBRE: string): Observable<Root> {
    const URL = `${this.urlApi}buscarproducts/${NOMBRE}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<Root>(URL);
  }

  public getAllProducts(): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.urlApi + 'allproducts')
  }




  //Empleado API
  public getEmpleados(): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.urlApi + 'empleados')
  }

  public getEmpleadobyID(IDEMPLEADO: number):Observable<Empleado>{
    return this.http.get<Empleado>(`${this.urlApi}${'empleados/'}${IDEMPLEADO}`)
}

saveEmpleado(empleado: Empleado): Observable<Empleado>{
  return this.http.post<Empleado>(this.urlApi +'createEmpleado',empleado).pipe(catchError
   (this.handleError)
  );
   }

   updateEmpleado(IDEMPLEADO: number,empleado: Empleado): Observable<Empleado>{
    return this.http.put<Empleado>(`${this.urlApi}${'updateEmpleado/'}${IDEMPLEADO}`,empleado)
  }



  //Factura API
  getFactura(pageNumber: number, pageSize: number): Observable<FacturaRoot>{
    const URL = `${this.urlApi + 'factura'}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return  this.http.get<FacturaRoot>(URL);
  }

  getFacturabyID(NumeroFactura: number): Observable<Factura>{
    return this.http.get<Factura>(`${this.urlApi}${'factura/'}${NumeroFactura}`)
  }

  CrearFactura(factura: DatosFactura): Observable<DatosFactura>{
    return this.http.post<DatosFactura>(this.urlApi +'createfactura',factura).pipe(catchError
     (this.handleError)
    );
     }

  getUltimaFactura(): Observable<DatosDetalleFactura[]>{
    return this.http.get<DatosDetalleFactura[]>(this.urlApi + 'ultimafactura')
  }

  CrearDetalleFactura(factura: DatosDetalleFactura): Observable<DatosDetalleFactura>{
    return this.http.post<DatosDetalleFactura>(this.urlApi +'createdetallefactura',factura).pipe(catchError
     (this.handleError)
    );
     }

  private handleError(error: any): Observable<any> {
    console.error('Error al realizar la solicitud:', error);
    throw error;
  }
}
