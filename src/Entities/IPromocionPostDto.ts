import IImagenPromocion from "./IImagenPromocion"
import { IPromocionDetalle } from "./IPromocionDetalle"

export default interface IPromocionPostDto {
    id?: number
    baja?: boolean
    fechaDesde: Date
    fechaHasta: Date
    horaDesde: Date
    horaHasta: Date
    denominacion: string
    descripcionDescuento: string
    precioPromocional: number
    tipoPromocionId: number
    promocionDetalle: IPromocionDetalle[]
    imagenes: IImagenPromocion[]
    idSucursaler:number[]
}