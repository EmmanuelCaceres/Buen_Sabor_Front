import { useState, useEffect } from "react";
import ArticuloInsumoService from "../Functions/Services/ArticuloInsumoService";
import IArticuloInsumo from "../Entities/IArticuloInsumo";

const useBuscarInsumo = (apiUrl: string) => {
    const [insumos, setInsumos] = useState<IArticuloInsumo[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const buscarInsumo = async (termino: string) => {
        if (!termino.trim()) {
            setInsumos([]);
            return;
        }

        try {
            const result = new ArticuloInsumoService(
                `${apiUrl}articulosInsumos/search?denominacion=`
            );
            const insumosResult = await result.buscarInsumoXDenominacion(termino);
            setInsumos(insumosResult || []);
        } catch (error) {
            console.error("Error buscando insumo:", error);
            setInsumos([]);
        }
    };

    useEffect(() => {
        buscarInsumo(searchTerm);
    }, [searchTerm]);

    return { insumos, searchTerm, setSearchTerm };
};

export default useBuscarInsumo;
