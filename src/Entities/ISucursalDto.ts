import IDomicilio from "./IDomicilio";

export default interface ISucursalDto{
    id?:number;
    nombre:string;
    horarioApertura:string;
    horarioCierre: string;
    baja: boolean;
    casaMatriz: boolean,
    domicilio:IDomicilio
}