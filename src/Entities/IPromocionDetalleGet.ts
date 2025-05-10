export default interface IPromocionDetalleGet {
    id:number,
    baja:boolean,
    cantidad:number,
    articulo:{
        id:number,
        baja:boolean,
        denominacion:string
    }
}