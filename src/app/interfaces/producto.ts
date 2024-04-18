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
}

export interface Categoria {
  idCategoria: number
  Nombre: string
}

