import ILocalidad from "./ILocalidad";

export default interface IDomicilio{
    id:number;
    baja:boolean
    calle:string;
    numero:number;
    cp:number;
    piso:number;
    nroDpto:number;
    localidad:ILocalidad
        
}