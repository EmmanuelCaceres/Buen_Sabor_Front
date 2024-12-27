import { GenericFetch } from "../GenericFetch";
import ICategoria from "../../Entities/ICategoria";
import { IPaginatedResponse } from "../../Entities/IPaginatedResponse";

export default class CategoriaService extends GenericFetch<ICategoria>{

    async getCategoryByDenominacion(codigo:string):Promise<ICategoria[] | null>{
        const response = await fetch(`${this.baseUrl}${codigo}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as ICategoria[];
    }

    async getAllCategorias(isPaginated: boolean = false): Promise<ICategoria[] | IPaginatedResponse<ICategoria>> {
        return await this.getAll(isPaginated);
    }
}