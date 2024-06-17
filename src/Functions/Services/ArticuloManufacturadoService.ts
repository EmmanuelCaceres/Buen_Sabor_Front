import IArticuloManufacturado from "../../Entities/IArticuloManufacturado";
import { GenericFetch } from "../GenericFetch";
export default class ArticuloManufacturadoService extends GenericFetch<IArticuloManufacturado>{

    async getArticuloByName(codigo:string):Promise<IArticuloManufacturado[] | null>{
        const response = await fetch(`${this.baseUrl}${codigo}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IArticuloManufacturado[];
    }

}