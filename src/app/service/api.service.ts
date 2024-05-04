import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError } from 'rxjs';
import { Producto, Root} from '../interfaces/producto'
import { Categoria } from '../interfaces/categoria';
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
  
  saveCliente(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.urlApi +'createcliente',cliente).pipe(catchError
     (this.handleError)
    );
     }

     public getClientes():Observable<Cliente[]>{
      return this.http.get<Cliente[]>(`${this.urlApi}${'cliente'}`)
    }

    public getClientebyID(IDCLIENTE: number):Observable<Cliente>{
      return this.http.get<Cliente>(`${this.urlApi}${'clientebyid/'}${IDCLIENTE}`)
  }

  updateCliente(IDCLIENTE: number,cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlApi}${'updatecliente/'}${IDCLIENTE}`,cliente)
  }


  

  //Category API

 public getCategory(): Observable<Categoria[]>{
    return this.http.get<Categoria[]>(this.urlApi + 'category')
  }

  public getAllCategory(): Observable<Categoria[]>{
    return this.http.get<Categoria[]>(this.urlApi + 'allcategory')
  }

  public getCategoriabyID(IDCATEGORIA: number):Observable<Categoria>{
    return this.http.get<Categoria>(`${this.urlApi}${'category/'}${IDCATEGORIA}`)
}

savecategoria(categoria: Categoria): Observable<Categoria>{
  return this.http.post<Categoria>(this.urlApi +'crearcategoria',categoria).pipe(catchError
   (this.handleError)
  );
   }

   updateCategoria(IDCATEGORIA: number,categoria: Categoria): Observable<Categoria>{
    return this.http.put<Categoria>(`${this.urlApi}${'updatecategoria/'}${IDCATEGORIA}`,categoria)
  }

  deletecategoria(IDCATEGORIA: number,categoria: Categoria): Observable<Categoria>{
    return this.http.put<Categoria>(`${this.urlApi}${'eliminarcategoria/'}${IDCATEGORIA}`,categoria)
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

  getAllProducts(): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.urlApi + 'allproducts')
  }

  getAllProductsbyName(NOMBRE: string): Observable<Producto[]>{
     return this.http.get<Producto[]>(`${this.urlApi}${'allproducts/'}${NOMBRE}`)
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

  getEmpleadobyCedula(Cedula: string): Observable<Empleado>{
    return this.http.get<Empleado>(`${this.urlApi}${'empleadocedula/'}${Cedula}`)
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

     DeleteProductodeFactura(NumeroFactura: number, IdProducto:number): Observable<void>{
      return this.http.delete<void>(`${this.urlApi}${'eliminarproducto/'}${NumeroFactura}${'/'}${IdProducto}`)
     }

  private handleError(error: any): Observable<any> {
    console.error('Error al realizar la solicitud:', error);
    throw error;
  }
}
