import { GenericFetch } from "../GenericFetch";
// import ICategoria from "../../Entities/ICategoria";
import IUnidadMedida from "../../Entities/IUnidadMedida";

export default class UnidadMedidaService extends GenericFetch<IUnidadMedida>{

    async getCategoryByDenominacion(codigo:string):Promise<IUnidadMedida[] | null>{
        const response = await fetch(`${this.baseUrl}${codigo}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IUnidadMedida[];
    }
}