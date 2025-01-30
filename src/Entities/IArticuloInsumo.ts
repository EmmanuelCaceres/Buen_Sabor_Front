import IArticulo from "./IArticulo";

export default interface IArticuloInsumo extends IArticulo{
    precioCompra:number;
    stockActual:number;
    stockMaximo:number;
    stockMinimo:number;
    esParaElaborar:boolean;
}