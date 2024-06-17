import ICategoria from "./ICategoria";
import IDomicilio from "./IDomicilio";

export default interface ISucursal{
    id?:number;
    nombre:string;
    horarioApertura:string;  // formato 'HH:mm'
    horarioCierre: string;
    eliminado: boolean;
    casaMatriz: boolean,
    domicilio:IDomicilio
    categorias: ICategoria[]
    
}