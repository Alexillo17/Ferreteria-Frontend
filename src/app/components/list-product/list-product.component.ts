import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Producto } from 'src/app/interfaces/producto';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})

export class ListProductComponent implements OnInit {

  product_result: Producto[] = [];

  constructor(private productservice: ApiService){

  }

  ngOnInit(): void {

this.MostrarProductos();

  }

  MostrarProductos(){
    this.productservice.getProducts().subscribe(product_result =>{
this.product_result = product_result;
debugger
console.log(this.product_result);
    })
  }

}






