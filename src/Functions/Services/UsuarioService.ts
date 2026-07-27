import { GenericFetch } from "../GenericFetch";
import IUsuario from "../../Entities/IUsuario";
import { IPaginatedResponse } from "../../Entities/IPaginatedResponse";

export default class UsuarioService extends GenericFetch<IUsuario> {
    
    async getUsuarioByNombreUsuario(nombreUsuario: string): Promise<IUsuario | null> {
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

    /**
     * Modifica el rol de un usuario usando el PUT heredado de GenericFetch
     * @param id ID del usuario a modificar
     * @param usuarioObjeto El objeto usuario con el rol cambiado
     */
    async updateUsuarioRol(id: number, usuarioObjeto: IUsuario): Promise<IUsuario> {
        // Aprovechamos el método update que ya viene en tu GenericFetch
        return await this.put(id, usuarioObjeto);
    }
}