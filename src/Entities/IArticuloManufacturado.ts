import IArticulo from "./IArticulo";
import IArticuloManufacturadoDetalles from "./IArticuloManufacturadoDetalle";

export default interface IArticuloManufacturado extends IArticulo{
    descripcion:string;
    tiempoEstimadoMinutos:number;
    preparacion:string;
    articuloManufacturadoDetalles:IArticuloManufacturadoDetalles[];
}