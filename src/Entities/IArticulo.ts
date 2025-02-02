import IUnidadMedida from "./IUnidadMedida";
import IImagenArticulo from "./IImagenArticulo";
import ICategoria from "./ICategoria";
import ISucursalDto from "./ISucursalDto";

export default interface IArticulo{
    id:number;
    denominacion:string;
    precioVenta:number;
    unidadMedida:IUnidadMedida;
    imagenes: IImagenArticulo[];
    categoria: ICategoria;
    sucursal: ISucursalDto;
    baja:boolean;
}