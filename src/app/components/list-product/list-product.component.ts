import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Producto, Root } from 'src/app/interfaces/producto';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit, AfterViewInit {

  product_result: Root | undefined;
  productagotado_result: Root | undefined;
  checkbox: boolean = false
  productosbyname: Root | undefined;
  busquedarealizada: boolean = false;
  dataSource = new MatTableDataSource<Producto>();
  NOMBRE: string = '';
  loading: boolean = false 
  productosEncontrados: boolean = true;

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
        this.MostrarProductos(this.paginator.pageIndex + 1, this.paginator.pageSize);
      });
    } else {
      IDPRODUCTO = 0;
      debugger
      this.OpenAddProduct();
    }
  }

  MostraProductosPorNombre(pageNumber: number, pageSize: number): void {
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
