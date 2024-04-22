import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError } from 'rxjs';
import {Categoria, Producto, Root} from '../interfaces/producto'
import { Proveedor } from '../interfaces/proveedor';
import { Factura, FacturaRoot } from '../interfaces/factura';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private urlApi = 'http://localhost:3000/api/'

  private product_response$ = new Subject<any>();


  constructor(private http: HttpClient) { }

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

  //Proveedor API
  public getProveedor(): Observable<Proveedor[]>{
    return this.http.get<Proveedor[]>(this.urlApi + 'proveedor')
  }

  //Factura API
  getFactura(pageNumber: number, pageSize: number): Observable<FacturaRoot>{
    const URL = `${this.urlApi + 'factura'}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return  this.http.get<FacturaRoot>(URL);
  }

  private handleError(error: any): Observable<any> {
    console.error('Error al realizar la solicitud:', error);
    throw error;
  }
}
