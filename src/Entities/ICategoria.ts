import IArticulo from "./IArticulo";
import ISucursalDto from "./ISucursalDto";

export default interface ICategoria{
    id:number;
    baja:boolean;
    denominacion:string;
    subCategorias: ICategoria[];
    articulos:IArticulo[];
    esInsumo: boolean;
    categoriaPadre: ICategoria | null;
    sucursales: ISucursalDto[];
    esParaVender: boolean;
}