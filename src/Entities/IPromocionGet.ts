import IImagenPromocion from "./IImagenPromocion";
import IPromocionDetalleGet from "./IPromocionDetalleGet";

export default interface IPromocion{
    id: number,
    baja: boolean,
    denominacion: string,
    fechaDesde: string,
    fechaHasta: string,
    horaDesde: string,
    horaHasta: string,
    descripcionDescuento: string,
    precioPromocional: number,
    promocionDetalles: IPromocionDetalleGet [],
    imagenes: IImagenPromocion[];
}