export interface Root {
  totalItems: number
  products: Producto[]
  totalPages: number
  currentPage: number
}

export interface Producto {
  IDPRODUCTO?: number
  NOMBRE: string
  UNIDADES: string
  PRECIO: number
  ESTADO: string
  IDCATEGORIA: string
  IDPROVEEDOR: string
  Stock: number
  Fecha: string
}

export interface ProductoRegistrado {
  idProducto?: number
  Cantidad: number
  Fecha: string
}



