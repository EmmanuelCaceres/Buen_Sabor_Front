import IArticulo from "./IArticulo"; // Interfaz base de artículos
import IPromocion from "./IPromocion";
import { TipoDetalle } from "./Enums";

export default interface IDetallePedido {
    id?: number; // Opcional al crear
    eliminado: boolean;
    cantidad: number;
    subTotal: number;
    articulo?: IArticulo | null; // Puede ser null si es promoción
    promocion?: IPromocion | null; // Puede ser null si es artículo
    tipoProducto: TipoDetalle; // "ARTICULO" o "PROMOCION"
}