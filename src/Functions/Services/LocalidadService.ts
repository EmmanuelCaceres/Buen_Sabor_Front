import ILocalidad from "../../Entities/ILocalidad";
import { GenericFetch } from "../GenericFetch";

export default class LocalidadService extends GenericFetch<ILocalidad>{
    async getLocalidadesByProvincia(codigo:number):Promise<ILocalidad[] | null>{
        const response = await fetch(`${this.baseUrl}${codigo}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as ILocalidad[];
    }
}