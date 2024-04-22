import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Producto, Root } from 'src/app/interfaces/producto';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { ListFacturaComponent } from '../list-factura/list-factura.component';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})

export class ListProductComponent implements OnInit, AfterViewInit {

  product_result: Root | undefined;
  dataSource = new MatTableDataSource<Producto>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productservice: ApiService, 
    private dialogRef: MatDialog,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => this.MostrarProductos(this.paginator.pageIndex + 1, this.paginator.pageSize));
    this.MostrarProductos(1, 10);
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
    if(IDPRODUCTO !== undefined && IDPRODUCTO !== null)
      {
        this.dialogRef.open(EditProductComponent,{
    data: {IDPRODUCTO: IDPRODUCTO}
   })
      }
      else{
        IDPRODUCTO = 0;
        this.OpenAddProduct();
      }
   
  }



  
}