import IArticulo from "./IArticulo";
import IArticuloInsumo from "./IArticuloInsumo";
import IArticuloManufacturado from "./IArticuloManufacturado";

export default interface IDetallePedido{
    id:number;
    eliminado:boolean;
    cantidad:number;
    subTotal:number;
    articulo:IArticuloManufacturado | IArticuloInsumo;
    
}