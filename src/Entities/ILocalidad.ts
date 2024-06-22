import IProvincia from "./IProvincia";

export default interface ILocalidad{
    id:number;
    baja:boolean;
    nombre:string;
    provincia:IProvincia
}