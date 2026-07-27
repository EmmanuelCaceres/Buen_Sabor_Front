import { useEffect, useState, useCallback } from "react";
import IUnidadMedida from "../../Entities/IUnidadMedida"; 
import UnidadMedidaService from "../../Functions/Services/UnidadMedidaService";
import GrillaGenerica from "./GrillaGenerica";

export default function GrillaUnidadMedida() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const [unidades, setUnidades] = useState<IUnidadMedida[]>([]);
    
    // Instanciamos el servicio (sin el slash final para evitar el error 500)
    const unidadService = new UnidadMedidaService(`${apiUrl}unidadesMedidas`);

    const fetchUnidades = useCallback(async () => {
        try {
            const data = await unidadService.getAllUnits(false);
            
            if (Array.isArray(data)) {
                setUnidades(data);
            } else if (data && 'content' in data) {
                setUnidades(data.content);
            }
        } catch (error) {
            console.error("Error al obtener unidades:", error);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchUnidades();
    }, [fetchUnidades]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Unidades de Medida</h2>
            <GrillaGenerica 
                data={unidades} 
                propertiesToShow={['denominacion']} 
                // Cambiamos urlParent por editItem para que coincida con GrillaProps
                editItem="/panel-usuario/unidades-medida/save/"
                // Cambiamos onDelete por deleteFunction para que coincida con GrillaProps
                deleteFunction={async (id) => {
                    if (window.confirm("¿Estás seguro de eliminar esta unidad?")) {
                        await unidadService.delete(id);
                        fetchUnidades();
                    }
                }}
                // Opcional: Si quieres que la columna diga algo distinto a "denominacion"
                columnAliases={{ denominacion: "Nombre de Unidad" }}
            />
        </div>
    );
}