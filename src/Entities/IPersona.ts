import Usuario from "./IUsuario"
import ImagenPersona from "./IImagenPersona"

export default interface IPersona{
    id:number,
    baja:boolean,
    nombre:string,
    apellido:string,
    telefono:string,
    fechaNac: Date,
    usuario: Usuario,
    imagen: ImagenPersona,
}