import ISucursal from "../../Entities/ISucursal";
import { GenericFetch } from "../GenericFetch";

export default class SucursalService extends GenericFetch<ISucursal>{

    async getSucursalesById(id:number):Promise<ISucursal[] | null>{
        const response = await fetch(`${this.baseUrl}${id}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as ISucursal[];
    }

}