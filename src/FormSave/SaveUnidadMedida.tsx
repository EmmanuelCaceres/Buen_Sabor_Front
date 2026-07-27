import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import IUnidadMedida from "../Entities/IUnidadMedida";
import UnidadMedidaService from "../Functions/Services/UnidadMedidaService";

export default function SaveUnidadMedida() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const { id } = useParams();
    const navigate = useNavigate();
    const unidadService = new UnidadMedidaService(`${apiUrl}unidadesMedidas`);

    const [unidadMedida, setUnidadMedida] = useState<IUnidadMedida>({
        id: Number(id),
        denominacion: '',
    });

    useEffect(() => {
        if (Number(id) !== 0) {
            getUnidadMedida();
        }
    }, [id]);

    const getUnidadMedida = async () => {
        try {
            const data = await unidadService.get(Number(id));
            if (data) {
                setUnidadMedida(data);
            }
        } catch (error) {
            console.error("Error al obtener la unidad de medida:", error);
        }
    };

    const saveUnidad = async () => {
        if (!unidadMedida.denominacion.trim()) {
            alert("La denominación es obligatoria.");
            return;
        }

        try {
            if (Number(id) !== 0) {
                await unidadService.put(Number(id), unidadMedida);
            } else {
                await unidadService.post(unidadMedida);
            }
            alert("Unidad de medida guardada con éxito!");
            navigate(-1);
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Hubo un error al guardar la unidad de medida.");
        }
    };

    return (
        <div className="container">
            <Link to="/panel-usuario/unidades-medida" className="btnVolver">
                <img width={24} height={24} src={arrow_left} alt="arrow_left" />
                <p style={{ margin: "0" }}>Volver</p>
            </Link>

            <div className="formContainer">
                <h2>{Number(id) === 0 ? "Crear" : "Editar"} Unidad de Medida</h2>
                
                <label htmlFor="denominacion">Denominación (ej: Kg, Unidades, Litros)</label>
                <input 
                    type="text" 
                    id="denominacion" 
                    name="denominacion" 
                    value={unidadMedida.denominacion} 
                    onChange={(e) => setUnidadMedida({ ...unidadMedida, denominacion: e.target.value })} 
                    placeholder="Nombre de la unidad..."
                />

                <button 
                    className="btn btn-primary" 
                    onClick={saveUnidad}
                    style={{ marginTop: "2rem" }}
                >
                    Guardar Unidad
                </button>
            </div>
        </div>
    );
}