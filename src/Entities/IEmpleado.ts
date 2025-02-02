import IPersona from "./IPersona";
import Sucursal from "./ISucursalDto"

export default interface IEmpleado extends IPersona{
    sucursal: Sucursal,
}