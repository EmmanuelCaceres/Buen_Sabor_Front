import { TipoPromocion } from "./TipoPromocion"
import IImagenPromocion  from "./IImagenPromocion"
import { IPromocionDetalle } from "./IPromocionDetalle"
//import ISucursalDto from "./ISucursalDto"

export default interface IPromocion{
    id:number
    baja:boolean
    fechaDesde : Date
    fechaHasta: Date
    horaDesde : string
    horaHasta : string
    denominacion: string
    descripcionDescuento : string
    precioPromocional : number
    tipoPromocion: TipoPromocion
    promocionDetalles: IPromocionDetalle[]
    imagenes: IImagenPromocion[];
    idsSucursal:number;
}