import IDomicilio from "./IDomicilio";
import IEmpresa from "./IEmpresa";

export default interface ISucursalDto{
    id?:number;
    nombre:string;
    horarioApertura:string;
    horarioCierre: string;
    baja: boolean;
    casaMatriz: boolean,
    domicilio:IDomicilio
    empresa:IEmpresa
}