import IArticuloInsumo from "../../Entities/IArticuloInsumo";
import { GenericFetch } from "../GenericFetch";

export default class ArticuloInsumoService extends GenericFetch<IArticuloInsumo>{

    async getInsumoByDenominacion(codigo:string):Promise<IArticuloInsumo[] | null>{
        const response = await fetch(`${this.baseUrl}${codigo}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IArticuloInsumo[];
    }

    async getInsumoParaVentas():Promise<IArticuloInsumo[] | null>{
        const response = await fetch(`${this.baseUrl}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IArticuloInsumo[];
    }

}