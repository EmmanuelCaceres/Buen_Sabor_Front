import ISucursal from "./ISucursal";

export default interface IEmpresa{
    id:number
    eliminado:boolean
    nombre:string;
    razonSocial:string;
    cuil:number;
    sucursales:ISucursal[];
}