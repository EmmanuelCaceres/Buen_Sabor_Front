import IArticuloManufacturado from "../../Entities/IArticuloManufacturado";
import ICategoria from "../../Entities/ICategoria";
import { IPaginatedResponse } from "../../Entities/IPaginatedResponse";
import { GenericFetch } from "../GenericFetch";
export default class ArticuloManufacturadoService extends GenericFetch<IArticuloManufacturado>{

    async getArticuloByDenominacion(codigo:string):Promise<IArticuloManufacturado[] | null>{
        const response = await fetch(`${this.baseUrl}${codigo}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IArticuloManufacturado[];
    }

    async getCategorias(): Promise<ICategoria[]> {
            const response = await fetch(`${this.baseUrl}categorias`);
            if (!response.ok) {
                console.error("Error en la respuesta del servidor:", response.status);
                return [];
            }
            
            const data = await response.json();
            //console.log("Datos de categorias:", data);  // Asegúrate de que `data` tiene la estructura que esperas
            
            // Devuelve el campo `content` si existe, o un array vacío si no
            return data || [];
    }

    async getPaginatedInsumos(): Promise<IPaginatedResponse<IArticuloManufacturado> | null> {
        try {
            const result = await this.getAll(true) as IPaginatedResponse<IArticuloManufacturado>;
            return result;
        } catch (error) {
            console.error("Error fetching paginated insumos:", error);
            return null;
        }
    }

    async getById(id: number): Promise<IArticuloManufacturado | null> {
            try {
                const response = await fetch(`${this.baseUrl}/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: IArticuloManufacturado = await response.json();
                return data;
            } catch (error) {
                console.error(`Error fetching insumo by ID ${id}:`, error);
                return null;
            }
        }
    
        async deleteInsumo(id: number): Promise<void> {
            const response = await fetch(`${this.baseUrl}articulosInsumos/${id}`, {
                method: 'DELETE',
            });
        
            if (!response.ok) {
                const errorData = await response.json(); // Try to get error details from the server
                throw new Error(`Error deleting insumo: ${response.status} - ${errorData?.message || response.statusText}`);
            }
        }

}