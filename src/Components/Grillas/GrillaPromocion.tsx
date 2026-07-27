import { useEffect, useState } from "react";
import IPromocion from "../../Entities/IPromocion";
import PromocionService from "../../Functions/Services/PromocionService";
import { useSucursal } from '../../context/SucursalContext';
import GrillaGenerica from "./GrillaGenerica";
import { Link } from "react-router-dom";

export default function GrillaPromocion() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const { sucursalId } = useSucursal();
    const [promociones, setPromociones] = useState<IPromocion[]>([]);

    const mostrarDatos = (url: string) => {
        const result = new PromocionService(url);
        result.getAll()
            .then(data => {
                let items: IPromocion[] = [];
                
                if (Array.isArray(data)) {
                    items = data;
                } else if ('content' in data && Array.isArray(data.content)) {
                    items = data.content;
                }
                
                // 🛑 CORRECCIÓN: Filtramos para NO mostrar las que están dadas de baja lógicamente
                const activos = items.filter(promo => promo.baja === false);
                setPromociones(activos);
            })
            .catch(error => {
                console.log("❌ ERROR AL TRAER PROMOS:", error);
            });
    }

    const eliminarPromocion = async (id: number) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta promoción?");
        if (!confirmar) return;

        try {
            // Hacemos el fetch manual acá para poder atrapar el error real del servidor
            const response = await fetch(`${apiUrl}promociones/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            // Si el backend rechaza el borrado (ej. error 500 por integridad de datos o 405)
            if (!response.ok) {
                throw new Error(`El servidor rechazó el borrado (Status: ${response.status})`);
            }
            
            // Solo si el servidor devolvió un 200 OK, lo sacamos de la pantalla
            setPromociones(prevPromociones => prevPromociones.filter(promo => promo.id !== id));
            alert("¡Promoción eliminada con éxito!");
            
        } catch (error) {
            console.error("❌ ERROR AL ELIMINAR PROMO:", error);
            alert("No se pudo eliminar. Es posible que esta promoción ya esté vinculada a pedidos históricos o el servidor haya denegado la acción.");
        }
    }

    useEffect(() => {
        mostrarDatos(`${apiUrl}promociones/porSucursal/${sucursalId}`)
    }, [apiUrl, sucursalId])

    return (
        <div>
            <div className="d-flex justify-content-end mb-3">
                <Link to="save/0" className="btn btn-primary">
                    + Nueva Promoción
                </Link>
            </div>
        <GrillaGenerica
            data={promociones}
            propertiesToShow={["imagenes", "denominacion", "descripcionDescuento", "precioPromocional", "fechaDesde", "fechaHasta", "promocionDetalles"]}
            columnAliases={{
                imagenes: "Imagen",
                denominacion: "Nombre",
                descripcionDescuento: "Detalle",
                precioPromocional: "Precio",
                fechaDesde: "Desde",
                fechaHasta: "Hasta",
                promocionDetalles: "Artículos"
            }}
            editItem="save/"
            deleteFunction={eliminarPromocion}
        />
        </div>
    )
}