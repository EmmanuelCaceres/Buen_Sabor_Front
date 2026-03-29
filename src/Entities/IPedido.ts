import IDetallePedido from "./IDetallePedido";
import ICliente from "./ICliente";
import IDomicilio from "./IDomicilio";
import ISucursal from "./ISucursalDto";
import { Estado, FormaPago, TipoEnvio } from "./Enums";

export default interface IPedido {
    id?: number;
    eliminado: boolean;
    horaEstimadaFinalizacion: string; // "HH:mm:ss"
    total: number;
    totalCosto: number;
    estado: Estado;
    tipoEnvio: TipoEnvio;
    formaPago: FormaPago;
    fechaPedido: string; // Usar string "YYYY-MM-DD" facilita el manejo con el back
    
    // Relaciones obligatorias para el checkout
    cliente: Partial<ICliente>; // Mandamos al menos el ID
    domicilio?: Partial<IDomicilio> | null; // Solo si es Delivery
    sucursal: Partial<ISucursal>; // Mandamos al menos el ID
    
    detallePedidos: IDetallePedido[];
}