import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError } from 'rxjs';
import {Producto} from '../interfaces/producto'

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private urlApi = 'http://localhost:3000/api/products'

  private urlApiPost = 'http://localhost:3000/api/createproducts'

  private product_response$ = new Subject<any>();


  constructor(private http: HttpClient) { }

  public getProducts(): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.urlApi);
  }

   saveProducts(product: Producto): Observable<Producto>{
 return this.http.post<Producto>(this.urlApiPost,product).pipe(catchError
  (this.handleError)
 );
  }

  private handleError(error: any): Observable<any> {
    console.error('Error al realizar la solicitud:', error);
    throw error;
  }
}
