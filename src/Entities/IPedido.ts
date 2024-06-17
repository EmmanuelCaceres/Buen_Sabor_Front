import IDetallePedido from "./IDetallePedido";

export default interface IPedido{
    id:number;
    eliminado:boolean;
    horaEstimadaFinalizacion:string;
    total:number;
    totalCosto:number;
    estado:string;
    tipoEnvio:string;
    formaPago:string;
    fechaPedido:Date;
    detallePedidos: IDetallePedido[]
}