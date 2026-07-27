// 1. Interfaces finales que usan tus componentes de Recharts
export interface IRankingProducto {
    denominacion: string;
    cantidad: number;
}

export interface ICategoriaDistribucion {
    categoria: string;
    cantidad: number;
}

export interface IIngresos {
    periodo: string;
    ingresos: number;
}

// 2. Interfaces espejo del Backend (Evitan el uso de 'any' al recibir los datos)
interface ICategoriaDistribucionBackend {
    denominacion: string;
    cantidad: number;
}

interface IIngresosBackend {
    mes: string;
    total: number;
}

// 3. Clase del Servicio adaptada con sucursalId
export default class EstadisticaService {
    private baseUrl = `${import.meta.env.VITE_URL_API_BACK}estadisticas`;

    // El ranking no requiere mapeo porque las keys coinciden al 100% con el DTO
    async getRankingProductos(sucursalId: number): Promise<IRankingProducto[]> {
        const response = await fetch(`${this.baseUrl}/ranking-productos/${sucursalId}`);
        if (!response.ok) {
            throw new Error("Error al obtener los datos estadísticos");
        }
        return await response.json() as IRankingProducto[];
    }

    // Mapeamos de ICategoriaDistribucionBackend a ICategoriaDistribucion de forma estricta
    async getDistribucionCategorias(sucursalId: number): Promise<ICategoriaDistribucion[]> {
        const response = await fetch(`${this.baseUrl}/distribucion-categorias/${sucursalId}`);
        if (!response.ok) throw new Error("Error en categorías");
        
        const data = await response.json() as ICategoriaDistribucionBackend[];
        
        return data.map((item: ICategoriaDistribucionBackend): ICategoriaDistribucion => ({
            categoria: item.denominacion,
            cantidad: item.cantidad
        }));
    }

    // Mapeamos de IIngresosBackend a IIngresos de forma estricta
    async getIngresosMensuales(sucursalId: number): Promise<IIngresos[]> {
        const response = await fetch(`${this.baseUrl}/ingresos-mensuales/${sucursalId}`);
        if (!response.ok) throw new Error("Error en ingresos");
        
        const data = await response.json() as IIngresosBackend[];
        
        return data.map((item: IIngresosBackend): IIngresos => ({
            periodo: item.mes,
            ingresos: item.total
        }));
    }
}