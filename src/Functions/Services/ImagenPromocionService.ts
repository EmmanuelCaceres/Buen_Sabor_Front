import IImagenPromocion from "../../Entities/IImagenPromocion";
import { GenericFetch } from "../GenericFetch";

export default class ImagenPromocionService extends GenericFetch<IImagenPromocion> {

    // Método para cargar una nueva imagen asociada a una promoción
    async postImagen(file: FormData, idPromocion: number): Promise<IImagenPromocion | null> {
        try {
           
            const response = await fetch(`${this.baseUrl}/${idPromocion}`, {
                method: "POST",
                body: file,  // Usar formData que contiene el archivo
            });
    
            console.log("Respuesta bruta del servidor:", response);
    
            if (!response.ok) {
                throw new Error(`Error al subir la imagen. Código de estado: ${response.status}`);
            }
    
            const data = await response.json(); // 🔁 importante: parsear como JSON
            console.log("Respuesta procesada del servidor:", data);

            return data as IImagenPromocion;
  // Deberías procesar y retornar la respuesta aquí, no solo `null`
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