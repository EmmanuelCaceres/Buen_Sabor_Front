import IArticulo from "./IArticulo";
import ISucursal from "./ISucursal";

export default interface ICategoria{
    id:number;
    denominacion:string;
    sucursales:ISucursal[];
    subCategorias: ICategoria[];
    articulos:IArticulo[];
}