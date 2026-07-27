import IPersona from "./IPersona";
import IDomicilio from "./IDomicilio";

export default interface ICliente extends IPersona {
    domicilios: IDomicilio[];
}