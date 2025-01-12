import IImagenArticulo from "../../Entities/IImagenArticulo";
import { GenericFetch } from "../GenericFetch";

export default class ImagenArticuloService extends GenericFetch<IImagenArticulo> {

    // Método para cargar una nueva imagen
    async postImagen(file: FormData): Promise<IImagenArticulo | null> {
        try {
            const response = await fetch(`${this.baseUrl}`, {
                method: "POST",
                body: file,
            });
    
            // Depurar la respuesta del servidor
            console.log("Respuesta bruta del servidor:", response);
            if (!response.ok) {
                throw new Error(`Error al subir la imagen. Código de estado: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Respuesta procesada del servidor:", data);
    
            return data as IImagenArticulo;
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            return null;
        }
    }
    

    // Método para eliminar una imagen
    async deleteImagen(publicId: string, id: number): Promise<string> {
        try {
            const response = await fetch(`${this.baseUrl}/deleteImg`, {
                method: "POST",
                body: new URLSearchParams({
                    publicId: publicId,
                    id: id.toString(),
                }),
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la imagen");
            }

            const result = await response.text();  // Supongo que el servidor devuelve un mensaje de éxito o algo similar
            return result;
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
            throw error;  // Propagar el error
        }
    }
}