import IArticuloInsumo from "../../Entities/IArticuloInsumo";
import ICategoria from "../../Entities/ICategoria";
import { IPaginatedResponse } from "../../Entities/IPaginatedResponse";
import ISucursalDto from "../../Entities/ISucursalDto"; // Asegúrate de importar la interfaz de sucursal
import { GenericFetch } from "../GenericFetch";

export default class ArticuloInsumoService extends GenericFetch<IArticuloInsumo> {

    async getInsumoByDenominacion(codigo: string): Promise<IPaginatedResponse<IArticuloInsumo> | null> {
        const response = await fetch(`${this.baseUrl}${codigo}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IPaginatedResponse<IArticuloInsumo>;
    }
    
    async getInsumoParaVentas(): Promise<IPaginatedResponse<IArticuloInsumo> | null> {
        const response = await fetch(`${this.baseUrl}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IPaginatedResponse<IArticuloInsumo>;
    }
    

    async getSucursales(): Promise<ISucursalDto[]> {
        const response = await fetch(`${this.baseUrl}sucursales`);
        if (!response.ok) {
            console.error("Error en la respuesta del servidor:", response.status);
            return [];
        }
        
        const data = await response.json();
        console.log("Datos de sucursales:", data);  // Asegúrate de que `data` tiene la estructura que esperas
        
        // Devuelve el campo `content` si existe, o un array vacío si no
        return data || [];
    }

    async getCategorias(): Promise<ICategoria[]> {
        const response = await fetch(`${this.baseUrl}categorias`);
        if (!response.ok) {
            console.error("Error en la respuesta del servidor:", response.status);
            return [];
        }
        
        const data = await response.json();
        console.log("Datos de categorias:", data);  // Asegúrate de que `data` tiene la estructura que esperas
        
        // Devuelve el campo `content` si existe, o un array vacío si no
        return data || [];
    }
    

    
    
    async getPaginatedInsumos(): Promise<IPaginatedResponse<IArticuloInsumo> | null> {
        try {
            const result = await this.getAll(true) as IPaginatedResponse<IArticuloInsumo>;
            return result;
        } catch (error) {
            console.error("Error fetching paginated insumos:", error);
            return null;
        }
    }

    async getById(id: number): Promise<IArticuloInsumo | null> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: IArticuloInsumo = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching insumo by ID ${id}:`, error);
            return null;
        }
    }
    
}
