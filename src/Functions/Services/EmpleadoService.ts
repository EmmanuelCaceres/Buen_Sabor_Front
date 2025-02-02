import IEmpleado from "../../Entities/IEmpleado";
import { IPaginatedResponse } from "../../Entities/IPaginatedResponse";
import ISucursalDto from "../../Entities/ISucursalDto"; // Asegúrate de importar la interfaz de sucursal
import { GenericFetch } from "../GenericFetch";

export default class EmpleadoService extends GenericFetch<IEmpleado> {

    async getEmpleadobyDenominacion(codigo: string): Promise<IPaginatedResponse<IEmpleado> | null> {
        const response = await fetch(`${this.baseUrl}${codigo}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IPaginatedResponse<IEmpleado>;
    }
    

    async getSucursales(): Promise<ISucursalDto[]> {
        const response = await fetch(`${this.baseUrl}sucursales`);
        if (!response.ok) {
            console.error("Error en la respuesta del servidor:", response.status);
            return [];
        }
        
        const data = await response.json();
        //console.log("Datos de sucursales:", data);  // Asegúrate de que `data` tiene la estructura que esperas
        
        // Devuelve el campo `content` si existe, o un array vacío si no
        return data || [];
    }
    
    async getPaginatedEmpleados(): Promise<IPaginatedResponse<IEmpleado> | null> {
        try {
            const result = await this.getAll(true) as IPaginatedResponse<IEmpleado>;
            return result;
        } catch (error) {
            console.error("Error fetching paginated empleados:", error);
            return null;
        }
    }

    async getById(id: number): Promise<IEmpleado | null> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: IEmpleado = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching empleado by ID ${id}:`, error);
            return null;
        }
    }

    async deleteEmpleado(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}articulosInsumos/${id}`, {
            method: 'DELETE',
        });
    
        if (!response.ok) {
            const errorData = await response.json(); // Try to get error details from the server
            throw new Error(`Error deleting insumo: ${response.status} - ${errorData?.message || response.statusText}`);
        }
    }
    
}
