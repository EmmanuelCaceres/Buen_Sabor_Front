import IArticulo from "./IArticulo";
import ISucursalDto from "./ISucursalDto";

export default interface ICategoria{
    id:number;
    baja:boolean;
    Denominación:string;
    subCategorias: ICategoria[];
    articulos:IArticulo[];
    esInsumo: boolean;
    categoriaPadre: ICategoria | null;
    sucursales: ISucursalDto[];
}