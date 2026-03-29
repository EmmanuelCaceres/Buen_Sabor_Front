import IPersona from "./IPersona";
import IDomicilio from "./IDomicilio"; // Asegúrate de tener esta interfaz creada

export default interface ICliente extends IPersona {
    domicilios: IDomicilio[];
}