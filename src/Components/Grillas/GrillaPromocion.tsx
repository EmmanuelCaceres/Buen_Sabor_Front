import { useEffect, useState } from "react";
import IPromocion from "../../Entities/IPromocion";
import PromocionService from "../../Functions/Services/PromocionService";
import { useSucursal } from '../../context/SucursalContext';
import GrillaGenerica from "./GrillaGenerica";


export default function GrillaPromocion() {
    
    const apiUrl = import.meta.env.VITE_URL_API_BACK

    const { sucursalId } = useSucursal();
    const [promociones, setPromociones] = useState<IPromocion[]>([]);

    const mostrarDatos = (url: string) => {
        const result = new PromocionService(url);
        result.getAll()
            .then(data => {
                console.log("🔍 DATA CRUDA:", JSON.stringify(data, null, 2)); // <-- Esto te muestra bien estructurado el JSON
                if (Array.isArray(data)) {
                    setPromociones(data);
                } else if ('content' in data && Array.isArray(data.content)) {
                    setPromociones(data.content);
                } else {
                    setPromociones([]);
                }
            })
            .catch(error => {
                console.log("❌ ERROR AL TRAER PROMOS:", error);
            });
    }
    

    useEffect(() => {
        mostrarDatos(`${apiUrl}promociones/porSucursal/${sucursalId}`)
    }, [apiUrl])

    return(
            <GrillaGenerica
                data={promociones}
                propertiesToShow={["imagenes","denominacion", "descripcionDescuento","precioPromocional", "fechaDesde", "fechaHasta", "promocionDetalles"]}
                columnAliases={{
                    imagenes:"Imagen",
                    denominacion: "Nombre",
                    descripcionDescuento: "Detalle",
                    precioPromocional: "Precio",
                    fechaDesde: "Desde",
                    fechaHasta: "Hasta",
                    promocionDetalles: "Artículos"
                }}
                editItem="promociones/save/"
                deleteFunction={(id) => console.log("Eliminar promo", id)}
            />
    )
}