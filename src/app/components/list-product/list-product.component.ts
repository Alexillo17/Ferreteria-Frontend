import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';
import { Producto, Root } from 'src/app/interfaces/producto';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit, AfterViewInit {

  product_result: Root | undefined;
  product_resultPDF: Producto[] = [];
  productagotado_result: Root | undefined;
  productbydate: Root | undefined;
  allProducts: any[] = [];
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
    this.loadAllProducts();
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
        this.loadAllProducts();
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

  MostrarProductosbyDate(pageNumber: number, pageSize: number): void {
    const formatFecha = (fecha: string) => {
      const partes = fecha.split('-'); // Asumiendo que la fecha viene en formato 'yyyy-mm-dd'
      const year = partes[0];
      const month = partes[1];
      const day = partes[2];
      return `${month}/${day}/${year}`;
    };
  
    const fechaInicio = formatFecha(this.DateInicio);
    const fechaFin = formatFecha(this.DateFinal);
    const nombre = null;
  
debugger
    this.productservice.getProductsByDate(fechaInicio, fechaFin, nombre, pageNumber, pageSize)
      .subscribe((productodate: Root) => {
        console.log(productodate);
        this.productbydate = productodate;
        this.busquedabydate = true;
        this.dataSource.data = productodate.products;
      });
  }
  
  

  cambiarPagina(event: PageEvent): void {
    const pageNumber = event.pageIndex + 1; // Sumar 1 porque los índices de página suelen ser basados en 0
    const pageSize = event.pageSize;
  
    if (this.busquedarealizada) {
      // Buscar por nombre con paginación
      this.MostraProductosPorNombre(pageNumber, pageSize);
    } else if (this.busquedabydate) {
      // Buscar por fecha con paginación
      this.MostrarProductosbyDate(pageNumber, pageSize);
    } else {
      if (this.checkbox) {
        // Mostrar productos inactivos con paginación
        this.MostrarProductosInactivos(pageNumber, pageSize);
      } else {
        // Mostrar productos activos con paginación
        this.MostrarProductos(pageNumber, pageSize);
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
      this.loadAllProducts();
      if (this.checkbox) {
        this.MostrarProductosInactivos(1, this.paginator.pageSize)
      } else {
        this.MostrarProductos( 1, this.paginator.pageSize);
      }
    });
    
  }

  async loadAllProducts() {
    try {
     await this.productservice.getAllProductsActivo().subscribe(product_result =>{
        this.allProducts = product_result
        console.log(product_result);
      })
    } catch (error) {
      console.error('Error loading products', error);
    }
  }
  

  async generatePDF() {
   

     debugger;
    const doc = new jsPDF();
  
    // Agregar un título al documento
    const title = 'Listado de Productos';
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2; // Calcular la posición X para centrar el título
    doc.setFontSize(14); // Tamaño de la fuente para el título
    doc.text(title, titleX, 20); // Posición del título (centrado)
  
    // Definir las cabeceras de la tabla
    const head = [['Nombre', 'Unidades', 'Precio', 'Stock', 'Estado', 'Fecha', 'Categoría', 'Proveedor']];
  
    // Transformar los datos para el cuerpo de la tabla
    const body = this.allProducts.map(product => [
      product.NOMBRE,
      product.UNIDADES,
      `C${product.PRECIO}`,
      product.Stock,
      product.ESTADO,
      product.Fecha,
      product.IDCATEGORIA,
      product.IDPROVEEDOR
    ]);
  
    debugger;
  
    // Generar la tabla en el PDF
    (doc as any).autoTable({
      head: head,
      body: body,
      startY: 30 // Ajusta la posición de inicio de la tabla para que no se superponga con el título
    });
  
    debugger;
  
    doc.save('Stock Ferreteria.pdf');
  }
  
  

}
