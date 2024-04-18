import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError } from 'rxjs';
import {Categoria, Producto, Root} from '../interfaces/producto'
import { Proveedor } from '../interfaces/proveedor';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private urlApi = 'http://localhost:3000/api/'

  private product_response$ = new Subject<any>();


  constructor(private http: HttpClient) { }

  //Category API




  //Product API
  public getProducts(pageNumber: number, pageSize: number): Observable<Root>{
    const URL = `${this.urlApi + 'products'}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<Root>(URL);
  }

  public getCategory(): Observable<Categoria[]>{
    return this.http.get<Categoria[]>(this.urlApi + 'category')
  }

  public getProveedor(): Observable<Proveedor[]>{
    return this.http.get<Proveedor[]>(this.urlApi + 'proveedor')
  }

  public getProductibyID(IDPRODUCTO: number):Observable<Producto>{
    return this.http.get<Producto>(`${this.urlApi}${'products/'}${IDPRODUCTO}`)
  }

   saveProducts(product: Producto): Observable<Producto>{
 return this.http.post<Producto>(this.urlApi +'createproducts',product).pipe(catchError
  (this.handleError)
 );
  }

  private handleError(error: any): Observable<any> {
    console.error('Error al realizar la solicitud:', error);
    throw error;
  }
}
