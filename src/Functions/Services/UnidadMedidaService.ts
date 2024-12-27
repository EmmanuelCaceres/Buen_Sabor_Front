import { GenericFetch } from "../GenericFetch";
// import ICategoria from "../../Entities/ICategoria";
import IUnidadMedida from "../../Entities/IUnidadMedida";
import { IPaginatedResponse } from "../../Entities/IPaginatedResponse";

export default class UnidadMedidaService extends GenericFetch<IUnidadMedida>{

    async getUnitByDenominacion(codigo:string):Promise<IUnidadMedida[] | null>{
        const response = await fetch(`${this.baseUrl}${codigo}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IUnidadMedida[];
    }

    async getAllUnits(isPaginated: boolean = false): Promise<IUnidadMedida[] | IPaginatedResponse<IUnidadMedida>> {
            return await this.getAll(isPaginated);
        }
}