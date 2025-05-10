import IPromocionDetalleGet from "./IPromocionDetalleGet";

export default interface IPromocion{
    id: number,
    baja: boolean,
    denominacion: String,
    fechaDesde: String,
    fechaHasta: String,
    horaDesde: String,
    horaHasta: String,
    descripcionDescuento: String,
    precioPromocional: Number,
    promocionDetalles: IPromocionDetalleGet [],
}