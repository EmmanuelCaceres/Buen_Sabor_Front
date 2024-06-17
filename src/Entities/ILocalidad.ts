import IProvincia from "./IProvincia";

export default interface ILocalidad{
    id:number;
    eliminado:number;
    nombre:string;
    provincia:IProvincia
}