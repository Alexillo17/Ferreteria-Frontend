export interface FacturaRoot {
  totalFacturas: number
  facturas: Factura[]
  totalPages: number
  currentPage: number
}

export interface Factura {
    NumeroFactura: number
    Cliente: string
    Empleado: string
    Producto: string
    Cantidad: number
    Precio: number
    Total: number
  }

