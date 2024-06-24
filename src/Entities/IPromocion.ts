import { TipoPromocion } from "./TipoPromocion"

export default interface IPromocion{
    id:number
    baja:boolean
    fechaDesde : Date
    fechaHasta: Date
    horaDesde : Date
    horaHasta : Date
    descripcionDescuento : string
    precioPromocional : number
    tipoPromocion: TipoPromocion
}