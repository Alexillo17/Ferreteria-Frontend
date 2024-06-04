import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
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

  


  constructor(private http: HttpClient) { }




  //Cliente API

  private clienteAPI = 'http://localhost:3000/cliente/'

  public getClientebyCedula(CEDULA: string):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.clienteAPI}${'cliente/'}${CEDULA}`)
  }
  
  saveCliente(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.clienteAPI +'createcliente',cliente).pipe(catchError
     (this.handleError)
    );
     }

     public getClientes():Observable<Cliente[]>{
      return this.http.get<Cliente[]>(`${this.clienteAPI}${'cliente'}`)
    }

    public getClientesInactivos():Observable<Cliente[]>{
      return this.http.get<Cliente[]>(`${this.clienteAPI}${'clienteinactivo'}`)
    }

    public getClientebyID(IDCLIENTE: number):Observable<Cliente>{
      return this.http.get<Cliente>(`${this.clienteAPI}${'clientebyid/'}${IDCLIENTE}`)
  }

  updateCliente(IDCLIENTE: number,cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.clienteAPI}${'updatecliente/'}${IDCLIENTE}`,cliente)
  }

  getclientesbyname(Nombre: string): Observable<Cliente[]>{
    return this.http.get<Cliente[]>(`${this.clienteAPI}${'clientebyname/'}${Nombre}`)
 }

 getclientesInactivosbyname(Nombre: string): Observable<Cliente[]>{
  return this.http.get<Cliente[]>(`${this.clienteAPI}${'clienteinactivosbyname/'}${Nombre}`)
}

deletecliente(IDCLIENTE: number,cliente: Cliente): Observable<Cliente>{
  return this.http.put<Cliente>(`${this.clienteAPI}${'eliminarcliente/'}${IDCLIENTE}`,cliente)
}


  

  //Category API

  private categoriaAPI = 'http://localhost:3000/categoria/'

 public getCategory(): Observable<Categoria[]>{
    return this.http.get<Categoria[]>(this.categoriaAPI + 'category')
  }

  public getAllCategory(): Observable<Categoria[]>{
    return this.http.get<Categoria[]>(this.categoriaAPI + 'allcategory')
  }

  public getCategoriabyID(IDCATEGORIA: number):Observable<Categoria>{
    return this.http.get<Categoria>(`${this.categoriaAPI}${'category/'}${IDCATEGORIA}`)
}

savecategoria(categoria: Categoria): Observable<Categoria>{
  return this.http.post<Categoria>(this.categoriaAPI +'crearcategoria',categoria).pipe(catchError
   (this.handleError)
  );
   }

   updateCategoria(IDCATEGORIA: number,categoria: Categoria): Observable<Categoria>{
    return this.http.put<Categoria>(`${this.categoriaAPI}${'updatecategoria/'}${IDCATEGORIA}`,categoria)
  }

  deletecategoria(IDCATEGORIA: number,categoria: Categoria): Observable<Categoria>{
    return this.http.put<Categoria>(`${this.categoriaAPI}${'eliminarcategoria/'}${IDCATEGORIA}`,categoria)
  }



  

  //Product API

  private productoAPI = 'http://localhost:3000/producto/'

  public getProducts(pageNumber: number, pageSize: number): Observable<Root>{
    const URL = `${this.productoAPI + 'products'}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<Root>(URL);
  }

  public getProductsInactivos(pageNumber: number, pageSize: number): Observable<Root>{
    const URL = `${this.productoAPI + 'productsinactivos'}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<Root>(URL);
  }

  public getProductibyID(IDPRODUCTO: number):Observable<Producto>{
    return this.http.get<Producto>(`${this.productoAPI}${'products/'}${IDPRODUCTO}`)
  }

   saveProducts(product: Producto): Observable<Producto>{
 return this.http.post<Producto>(this.productoAPI +'createproducts',product).pipe(catchError
  (this.handleError)
 );
  }

  updateProducts(IDPRODUCTO: number,product: Producto): Observable<Producto>{
    return this.http.put<Producto>(`${this.productoAPI}${'updateproduct/'}${IDPRODUCTO}`,product)
  }

  deleteproducto(IDPRODUCTO: number,product: Producto): Observable<Producto>{
    return this.http.put<Producto>(`${this.productoAPI}${'EliminarProducto/'}${IDPRODUCTO}`,product)
  }


  getproductbyname(pageNumber: number, pageSize: number, NOMBRE: string): Observable<Root> {
    const URL = `${this.productoAPI}buscarproducts/${NOMBRE}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<Root>(URL);
  }

  getproductInactivosbyname(pageNumber: number, pageSize: number, NOMBRE: string): Observable<Root> {
    const URL = `${this.productoAPI}buscarproductsinactivos/${NOMBRE}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<Root>(URL);
  }

  getAllProducts(): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.productoAPI + 'allproducts')
  }

  getAllProductsbyName(NOMBRE: string): Observable<Producto[]>{
     return this.http.get<Producto[]>(`${this.productoAPI}${'allproducts/'}${NOMBRE}`)
  }


  getProductsByDate(fechaInicio: string, fechaFin: string, nombre: string | null, pageNumber: number, pageSize: number): Observable<any> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (nombre) {
      params = params.set('nombre', nombre);
    }

    return this.http.get<any>(`${this.productoAPI}/buscarproductosfecha`, { params });
  }



  //Empleado API

  private empleadoAPI = 'http://localhost:3000/empleado/'

  public getEmpleados(): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.empleadoAPI + 'empleados')
  }

  public getEmpleadosInactivos(): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.empleadoAPI + 'empleadosinactivos')
  }


  public getEmpleadobyID(IDEMPLEADO: number):Observable<Empleado>{
    return this.http.get<Empleado>(`${this.empleadoAPI}${'empleados/'}${IDEMPLEADO}`)
}

saveEmpleado(empleado: Empleado): Observable<Empleado>{
  return this.http.post<Empleado>(this.empleadoAPI +'createEmpleado',empleado).pipe(catchError
   (this.handleError)
  );
   }

   updateEmpleado(IDEMPLEADO: number,empleado: Empleado): Observable<Empleado>{
    return this.http.put<Empleado>(`${this.empleadoAPI}${'updateEmpleado/'}${IDEMPLEADO}`,empleado)
  }

  getEmpleadobyCedula(Cedula: string): Observable<Empleado>{
    return this.http.get<Empleado>(`${this.empleadoAPI}${'empleadocedula/'}${Cedula}`)
  }

  deleteEmpleado(IDEMPLEADO: number,empleado: Empleado): Observable<Empleado>{
    return this.http.put<Empleado>(`${this.empleadoAPI}${'eliminarempleado/'}${IDEMPLEADO}`,empleado)
  }
  



  //Factura API

  private facturaAPI = 'http://localhost:3000/factura/'

  getFactura(pageNumber: number, pageSize: number): Observable<FacturaRoot>{
    const URL = `${this.facturaAPI + 'factura'}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return  this.http.get<FacturaRoot>(URL);
  }

  getFacturabyID(NumeroFactura: number): Observable<Factura>{
    return this.http.get<Factura>(`${this.facturaAPI}${'factura/'}${NumeroFactura}`)
  }

  CrearFactura(factura: DatosFactura): Observable<DatosFactura>{
    return this.http.post<DatosFactura>(this.facturaAPI +'createfactura',factura).pipe(catchError
     (this.handleError)
    );
     }

  getUltimaFactura(): Observable<DatosDetalleFactura[]>{
    return this.http.get<DatosDetalleFactura[]>(this.facturaAPI + 'ultimafactura')
  }

  CrearDetalleFactura(factura: DatosDetalleFactura): Observable<DatosDetalleFactura>{
    return this.http.post<DatosDetalleFactura>(this.facturaAPI +'createdetallefactura',factura).pipe(catchError
     (this.handleError)
    );
     }

     DeleteProductodeFactura(NumeroFactura: number, IdProducto:number): Observable<void>{
      return this.http.delete<void>(`${this.facturaAPI}${'eliminarproducto/'}${NumeroFactura}${'/'}${IdProducto}`)
     }

     DeleteFactura(NumFactura:number): Observable<void>{
      return this.http.delete<void>(`${this.facturaAPI}${'eliminarfactura/'}${NumFactura}`)
     }

     getFacturabyDate(FechaInicio: string, FechaFinal: string, pageNumber: number, pageSize: number): Observable<FacturaRoot> {
      const URL = `${this.facturaAPI}facturasbyDate/${FechaInicio}/${FechaFinal}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      return this.http.get<FacturaRoot>(URL);
    }

  private handleError(error: any): Observable<any> {
    console.error('Error al realizar la solicitud:', error);
    throw error;
  }
}
