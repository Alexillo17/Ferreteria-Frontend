import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Producto, Root } from 'src/app/interfaces/producto';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
    this.dialogRef.open(AddProductComponent);
  }

  OpenEditProduct(IDPRODUCTO?: number): void{
   this.dialogRef.open(AddProductComponent,{
    data: {IDPRODUCTO: IDPRODUCTO}
   })
  }

  
}