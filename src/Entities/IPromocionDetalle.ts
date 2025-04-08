import IArticuloManufacturado from "./IArticuloManufacturado"

export interface IPromocionDetalle {
    id?: number
    baja: boolean
    cantidad:number
    articulo:IArticuloManufacturado
}