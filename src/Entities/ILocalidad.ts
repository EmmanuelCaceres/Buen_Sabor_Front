import IProvincia from "./IProvincia";

export default interface ILocalidad{
    id:number;
    baja:number;
    nombre:string;
    provincia:IProvincia
}