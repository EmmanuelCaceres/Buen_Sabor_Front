import IArticuloInsumo from "../../Entities/IArticuloInsumo";
import ISucursalDto from "../../Entities/ISucursalDto"; // Asegúrate de importar la interfaz de sucursal
import { GenericFetch } from "../GenericFetch";

export default class ArticuloInsumoService extends GenericFetch<IArticuloInsumo> {

    async getInsumoByDenominacion(codigo: string): Promise<IArticuloInsumo[] | null> {
        const response = await fetch(`${this.baseUrl}${codigo}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IArticuloInsumo[];
    }

    async getInsumoParaVentas(): Promise<IArticuloInsumo[] | null> {
        const response = await fetch(`${this.baseUrl}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IArticuloInsumo[];
    }

    // Método para obtener sucursales
    async getSucursales(): Promise<ISucursalDto[] | null> {
        const response = await fetch(`${this.baseUrl}sucursales`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as ISucursalDto[];
    }
}
