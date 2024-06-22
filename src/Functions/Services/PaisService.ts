import IPais from "../../Entities/IPais";
import { GenericFetch } from "../GenericFetch";

export default class PaisService extends GenericFetch<IPais>{
    async getPaises():Promise<IPais[] | null>{
        const response = await fetch(`${this.baseUrl}1`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IPais[];
    }
}