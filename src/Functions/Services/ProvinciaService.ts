import IProvincia from "../../Entities/IProvincia";
import { GenericFetch } from "../GenericFetch";

export default class ProvinciaService extends GenericFetch<IProvincia>{
    async getProvinciasByPais(codigo:number):Promise<IProvincia[] | null>{
        const response = await fetch(`${this.baseUrl}${codigo}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IProvincia[];
    }
}