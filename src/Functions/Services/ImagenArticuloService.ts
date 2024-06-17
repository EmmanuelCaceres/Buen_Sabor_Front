import IImagenArticulo from "../../Entities/IImagenArticulo";
import { GenericFetch } from "../GenericFetch";
export default class ImagenArticuloService extends GenericFetch<IImagenArticulo>{

    async postImagen(file:FormData):Promise<IImagenArticulo | null>{
        const response = await fetch(`${this.baseUrl}`, {
            method: "POST",
            body: file,
        });
        const data = await response.json();
        return data as IImagenArticulo;
    }

}