import IUnidadMedida from "./IUnidadMedida";
import IImagenArticulo from "./IImagenArticulo";
import ICategoria from "./ICategoria";
import ISucursalDto from "./ISucursalDto";

export default interface IArticulo{
    id:number;
    Denominación:string;
    precioVenta:number;
    unidadMedida:IUnidadMedida;
    Imagen: IImagenArticulo[];
    categoria: ICategoria;
    sucursal: ISucursalDto;
    baja:boolean;
}