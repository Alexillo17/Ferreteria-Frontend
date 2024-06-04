import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';
import { Producto, Root } from 'src/app/interfaces/producto';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit, AfterViewInit {

  product_result: Root | undefined;
  productagotado_result: Root | undefined;
  productbydate: Root | undefined;
  checkbox: boolean = false
  productosbyname: Root | undefined;
  busquedarealizada: boolean = false;
  busquedabydate: boolean = false;
  dataSource = new MatTableDataSource<Producto>();
  NOMBRE: string = '';
  loading: boolean = false 
  productosEncontrados: boolean = true;
  DateInicio: string = ''
  DateFinal: string = ''


  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private productservice: ApiService, 
              private dialogRef: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => this.MostrarProductos(this.paginator.pageIndex + 1, this.paginator.pageSize));
    this.MostrarProductos(1, 10);
  }

  toggleProductoList() {
    if (this.checkbox) {
      if (this.NOMBRE === '') {
        this.MostrarProductosInactivos(1, this.paginator.pageSize); // Mostrar productos inactivos si el checkbox está marcado
      } else {
        this.MostraProductosPorNombre(1, this.paginator.pageSize); // Mostrar productos inactivos filtrados por nombre
      }
    } else {
      if (this.NOMBRE === '') {
        this.NOMBRE === '';
        this.busquedarealizada = false;
        this.MostrarProductos(1, this.paginator.pageSize); // Mostrar productos activos si el checkbox está desmarcado
      } else {
        this.busquedarealizada = false;
        this.MostraProductosPorNombre(1, this.paginator.pageSize); // Mostrar productos activos filtrados por nombre
      }
    }
  }
  

  MostrarProductos(pageNumber: number, pageSize: number): void {
    this.productservice.getProducts(pageNumber, pageSize).subscribe((result: Root) => {
      this.product_result = result;
      this.dataSource.data = result.products;
      console.log(result)
    });
  }

  MostrarProductosInactivos(pageNumber: number, pageSize: number): void {
    this.productservice.getProductsInactivos(pageNumber, pageSize).subscribe((result: Root) => {
      this.productagotado_result = result;
      this.dataSource.data = result.products;
    });
  }

 
  OpenAddProduct(): void {
    this.dialogRef.open(AddProductComponent,{
      disableClose: true
    }).afterClosed().subscribe(()=>{
      this.MostrarProductos(1, this.paginator.pageSize);
    });
  }

  OpenEditProduct(IDPRODUCTO?: number): void{
    if(IDPRODUCTO !== undefined && IDPRODUCTO !== null) {
      this.dialogRef.open(EditProductComponent,{
        disableClose: true,
        data: {IDPRODUCTO: IDPRODUCTO}
      }).afterClosed().subscribe(()=>{
        if (this.checkbox) {
          this.MostrarProductosInactivos(1, this.paginator.pageSize); // Mostrar productos inactivos
        } else {
          this.MostrarProductos(1, this.paginator.pageSize); // Mostrar productos activos
        }
      });
    } else {
      IDPRODUCTO = 0;
      debugger
      this.OpenAddProduct();
    }
  }

  camposRellenos: boolean = false;

  checkInputs() {
    this.camposRellenos = !!(this.DateInicio && this.DateFinal);
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    // Formatear la fecha actual en el formato YYYY-MM-DD requerido por el input type="date"
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  MostraProductosPorNombre(pageNumber: number, pageSize: number): void {

    const fechaInicio = this.DateInicio;
    const fechaFin = this.DateFinal;
    const nombre = this.NOMBRE; // or null if you don't want to filter by name

    if(fechaInicio !== '' && fechaFin !== '' && nombre !== ''){
      debugger
      this.productservice.getProductsByDate(fechaInicio, fechaFin, nombre, pageNumber, pageSize)
      .subscribe((productodate: Root) =>{
        this.productosbyname = productodate;
        this.busquedabydate = false
        this.busquedarealizada = true;
        this.dataSource.data = productodate.products;
      }) 
      return; 
    }
    if (this.NOMBRE === '') {
      this.busquedarealizada = false;
      this.productosEncontrados = true; // No hay búsqueda, por lo tanto, hay productos
    } else {
      if (this.checkbox) {
        this.productservice.getproductInactivosbyname(pageNumber, pageSize, this.NOMBRE).subscribe((producto: Root) =>{
          this.productosbyname = producto;
          this.busquedarealizada = true;
          this.productosEncontrados = producto.products.length > 0; // Verificar si se encontraron productos
          this.dataSource.data = producto.products;
        });
      } else {
        this.productservice.getproductbyname(pageNumber, pageSize, this.NOMBRE).subscribe((producto: Root) =>{
          this.productosbyname = producto;
          this.busquedarealizada = true;
          this.productosEncontrados = producto.products.length > 0; // Verificar si se encontraron productos
          this.dataSource.data = producto.products;
        });
      }
    }
    
  }

  MostrarProductosbyDate(pageNumber: number, pageSize: number): void{
    const fechaInicio = this.DateInicio;
    const fechaFin = this.DateFinal;
    const nombre = null
    console.log('Hola')
    this.productservice.getProductsByDate(fechaInicio, fechaFin, nombre, pageNumber, pageSize)
      .subscribe((productodate: Root) =>{
        console.log(productodate)
        this.productbydate = productodate;
        this.busquedabydate = true
        this.dataSource.data = productodate.products;
      })  
  }
  

  cambiarPagina(event: any) {
    if (this.busquedarealizada) {
      this.MostraProductosPorNombre(event.pageIndex + 1, event.pageSize); // Buscar por nombre con paginación
    } else {
      if (this.checkbox) {
        this.MostrarProductosInactivos(event.pageIndex + 1, event.pageSize); // Mostrar productos inactivos
      } else {
        this.MostrarProductos(event.pageIndex + 1, event.pageSize); // Mostrar productos activos
      }
    }
  }

  DeleteProducto(producto: Producto): void {
    if(producto.ESTADO === 'Agotado'){
      return;
    }
    else{
      if (producto !== undefined && producto !== null && producto.IDPRODUCTO !== undefined && producto.IDPRODUCTO !== null) {
      this.productservice.deleteproducto(producto.IDPRODUCTO, producto).subscribe(() => {
        console.log('Empleado Eliminado');
        this.OpenDeleteProducto()
      });
      debugger
    }
    }
  }

  OpenDeleteProducto(): void {
    this.dialogRef.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'dado de baja',
        TituloModal: 'Producto',
      }
    }).afterClosed().subscribe(()=>{
      if (this.checkbox) {
        this.MostrarProductosInactivos(1, this.paginator.pageSize)
      } else {
        this.MostrarProductos( 1, this.paginator.pageSize);
      }
    });
    
  }
    

}
