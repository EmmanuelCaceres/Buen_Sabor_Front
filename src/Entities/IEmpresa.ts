import ISucursal from "./ISucursal";

export default interface IEmpresa{
    id:number
    baja:boolean
    nombre:string;
    razonSocial:string;
    cuil:number;
    sucursales:ISucursal[];
}