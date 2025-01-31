import IArticulo from "./IArticulo";

export default interface ICategoria{
    id:number;
    denominacion:string;
    subCategorias: ICategoria[];
    articulos:IArticulo[];
    esInsumo: boolean;
    categoriaPadre: ICategoria | null;
}