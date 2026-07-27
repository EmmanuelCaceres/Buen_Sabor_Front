import { useEffect, useState, useCallback } from "react";
import EstadisticaService, { IRankingProducto, ICategoriaDistribucion, IIngresos } from "../Functions/Services/EstadisticaService";
import GraficoRanking from "./GraficoRanking";
import GraficoIngresos from "./GraficoIngresos";
import GraficoCategorias from "./GraficoCategorias";

export default function Inicio() {
    const [dataRanking, setDataRanking] = useState<IRankingProducto[]>([]);
    const [dataCategorias, setDataCategorias] = useState<ICategoriaDistribucion[]>([]);
    const [dataIngresos, setDataIngresos] = useState<IIngresos[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Obtenemos el id de la sucursal activa dinámicamente desde el localStorage
    const sucursalId = Number(localStorage.getItem("sucursalId")) || 1;

    const procesarIngresosMensuales = (datosBackend: IIngresos[]): IIngresos[] => {
        const nombresMeses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const mesesCompletos: IIngresos[] = [];
        
        for (let i = 1; i <= 12; i++) {
            const etiquetaBackend = `Mes ${i}`; 
            const nombreMesReal = nombresMeses[i - 1]; 
            
            const mesExistente = datosBackend.find(d => d.periodo === etiquetaBackend);
            
            if (mesExistente) {
                mesesCompletos.push({
                    periodo: nombreMesReal, 
                    ingresos: mesExistente.ingresos
                });
            } else {
                mesesCompletos.push({ 
                    periodo: nombreMesReal, 
                    ingresos: 0 
                });
            }
        }
        
        return mesesCompletos;
    };

    // Agregamos sucursalId a las dependencias para que el callback se entere si cambia
    const fetchEstadisticas = useCallback(async () => {
        try {
            setLoading(true);
            const servicio = new EstadisticaService();
            
            // Pasamos el sucursalId correspondiente a cada petición de la API
            const [ranking, categorias, ingresosRaw] = await Promise.all([
                servicio.getRankingProductos(sucursalId),
                servicio.getDistribucionCategorias(sucursalId),
                servicio.getIngresosMensuales(sucursalId)
            ]);

            setDataRanking(ranking);
            setDataCategorias(categorias);
            const ingresosProcesados = procesarIngresosMensuales(ingresosRaw);
            setDataIngresos(ingresosProcesados);
        } catch (error) {
            console.error("Error cargando estadísticas:", error);
        } finally {
            setLoading(false);
        }
    }, [sucursalId]); // <-- Re-evalúa la función si cambia la sucursal

    useEffect(() => {
        fetchEstadisticas();
    }, [fetchEstadisticas]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4 py-4">
            <div className="row mb-4">
                <div className="col">
                    <h1 className="h2" style={{ color: '#2c3e50', fontWeight: 700 }}>
                        ¡Bienvenido al Panel de Control!
                    </h1>
                    <p className="text-muted">
                        Métricas clave sobre el rendimiento de la <strong>Sucursal #{sucursalId}</strong> de "Buen Sabor".
                    </p>
                </div>
            </div>

            {/* Fila superior: Evolución de Ingresos */}
            <div className="row mb-4">
                <div className="col-12">
                    <GraficoIngresos data={dataIngresos} />
                </div>
            </div>

            {/* Fila inferior: Ranking y Categorías uno al lado del otro */}
            <div className="row">
                <div className="col-12 col-lg-7 mb-4">
                    <GraficoRanking data={dataRanking} />
                </div>
                <div className="col-12 col-lg-5 mb-4">
                    <GraficoCategorias data={dataCategorias} />
                </div>
            </div>
        </div>
    );
}