import IArticuloInsumo from "./IArticuloInsumo"
// import IArticuloManufacturado from "./IArticuloManufacturado"

export default interface IArticuloManufacturadoDetalles{
    id:number;
    cantidad:number;
    articuloInsumo:IArticuloInsumo;
}