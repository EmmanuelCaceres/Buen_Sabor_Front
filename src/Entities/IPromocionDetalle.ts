export interface IPromocionDetalle {
    id?: number;
    baja: boolean;
    cantidad: number;
    articulo: {
        id: number;
        denominacion: string;
    };
}