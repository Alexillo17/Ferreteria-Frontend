import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Proveedor } from '../interfaces/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private urlApi = 'http://localhost:3000/proveedor/'

  constructor(private http: HttpClient) { }

    //Proveedor API
    public getProveedor(): Observable<Proveedor[]>{
      return this.http.get<Proveedor[]>(this.urlApi + 'proveedor')
    }
  
    public getProveedorInactivos(): Observable<Proveedor[]>{
      return this.http.get<Proveedor[]>(this.urlApi + 'allproveedor')
    }
  
    saveproveedor(proveedor: Proveedor): Observable<Proveedor>{
      return this.http.post<Proveedor>(this.urlApi +'createproveedor',proveedor).pipe(catchError
       (this.handleError)
      );
       }
       
       private handleError(error: any): Observable<any> {
        console.error('Error al realizar la solicitud:', error);
        throw error;
      } 
  
  
    public getProveedorbyID(IDPROVEEDOR: number):Observable<Proveedor>{
        return this.http.get<Proveedor>(`${this.urlApi}${'proveedor/'}${IDPROVEEDOR}`)
    }
  
    updateProveedor(IDPROVEEDOR: number,proveedor: Proveedor): Observable<Proveedor>{
      return this.http.put<Proveedor>(`${this.urlApi}${'updateproveedor/'}${IDPROVEEDOR}`,proveedor)
    }
  
    deleteProveedor(IDPROVEEDOR: number,proveedor: Proveedor): Observable<Proveedor>{
      return this.http.put<Proveedor>(`${this.urlApi}${'deleteproveedor/'}${IDPROVEEDOR}`,proveedor)
    }

    getProveedorbyCedula(Cedula: string): Observable<Proveedor>{
      return this.http.get<Proveedor>(`${this.urlApi}${'proveedorcedula/'}${Cedula}`)
    }
  
}
