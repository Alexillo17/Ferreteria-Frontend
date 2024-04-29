import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Producto, Root } from 'src/app/interfaces/producto';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit, AfterViewInit {

  product_result: Root | undefined;
  productosbyname: Root | undefined;
  busquedarealizada: boolean = false;
  dataSource = new MatTableDataSource<Producto>();
  NOMBRE: string = '';

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private productservice: ApiService, 
              private dialogRef: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.cambiarPagina();
    });

    // Cargar productos por defecto
    if (!this.busquedarealizada) {
      this.MostrarProductos(1, this.paginator.pageSize);
    }
  }

  MostrarProductos(pageNumber: number, pageSize: number): void {
    this.productservice.getProducts(pageNumber, pageSize).subscribe((result: Root) => {
      this.product_result = result;
      this.dataSource.data = result.products;
    });
  }

  OpenAddProduct(): void {
    this.dialogRef.open(AddProductComponent,{
      disableClose: true
    });
  }

  OpenEditProduct(IDPRODUCTO?: number): void{
    if(IDPRODUCTO !== undefined && IDPRODUCTO !== null) {
      this.dialogRef.open(EditProductComponent,{
        data: {IDPRODUCTO: IDPRODUCTO}
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
    } else {
      this.productservice.getproductbyname(pageNumber, pageSize, this.NOMBRE).subscribe((producto: Root) =>{
        this.productosbyname = producto;
        this.busquedarealizada = true;
        this.dataSource.data = producto.products; // Actualizar dataSource
        console.log(producto);
      });
    }
  }

  cambiarPagina() {
    if (this.busquedarealizada) {
      this.MostraProductosPorNombre(this.paginator.pageIndex + 1, this.paginator.pageSize);
    } else {
      this.MostrarProductos(this.paginator.pageIndex + 1, this.paginator.pageSize);
    }
  }
}
