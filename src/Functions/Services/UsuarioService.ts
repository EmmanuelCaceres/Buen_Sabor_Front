import { GenericFetch } from "../GenericFetch";
import IUsuario from "../../Entities/IUsuario";
import { IPaginatedResponse } from "../../Entities/IPaginatedResponse";

export default class UsuarioService extends GenericFetch<IUsuario>{
    
    async getUsuarioByNombreUsuario(nombreUsuario:string):Promise<IUsuario | null>{
        const response = await fetch(`${this.baseUrl}${nombreUsuario}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as IUsuario;
    }

    async getAllUsuarios(isPaginated: boolean = false): Promise<IUsuario[] | IPaginatedResponse<IUsuario>> {
            return await this.getAll(isPaginated);
        }
}