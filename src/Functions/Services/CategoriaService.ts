import { GenericFetch } from "../GenericFetch";
import ICategoria from "../../Entities/ICategoria";
import { IPaginatedResponse } from "../../Entities/IPaginatedResponse";

export default class CategoriaService extends GenericFetch<ICategoria>{

    async getCategoryByDenominacion(isPaginated:boolean=false,keyword:string):Promise<ICategoria[] | IPaginatedResponse<ICategoria>>{
        const response = await fetch(`${this.baseUrl}${keyword}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        return isPaginated ? (data as IPaginatedResponse<ICategoria>) : (data as ICategoria[]);
    }

    async getAllCategorias(isPaginated: boolean = false): Promise<ICategoria[] | IPaginatedResponse<ICategoria>> {
        return await this.getAll(isPaginated);
    }

    async getAllParents(): Promise<ICategoria[]> {
        const response = await fetch(`${this.baseUrl}categorias/parents`);
    
        if (!response.ok) {
            throw new Error(`Error al obtener categorías padre. Status: ${response.status}`);
        }
    
        const data = await response.json();
        return data as ICategoria[];
    }
    
}