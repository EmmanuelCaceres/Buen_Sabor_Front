import React, { useState } from 'react'
import IPromocion from '../Entities/IPromocion';
import PromocionService from '../Functions/Services/PromocionService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TipoPromocion } from '../Entities/TipoPromocion';
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";

const SavePromocion = () => {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;

    const { id } = useParams();
    const navigate = useNavigate();

    const [promocion, setPromocion] = useState<IPromocion>({
        id: Number(id),
        baja: false,
        fechaDesde: new Date(),
        fechaHasta: new Date(),
        horaDesde: new Date(),
        horaHasta: new Date(),
        descripcionDescuento: "",
        precioPromocional: 0,
        tipoPromocion: TipoPromocion.HappyHour
    });

    const savePromocion = async () => {
        try {
            if (promocion.id !== 0) {
                await new PromocionService(`${apiUrl}promociones`).put(promocion.id, promocion);
            } else {
                await new PromocionService(`${apiUrl}promociones`).post(promocion);
            }
            alert("¡Promoción guardada con éxito!");
            navigate(-1); // Redirigir a la página anterior
        } catch (error) {
            console.error('Error al guardar la promoción:', error);
            alert("Hubo un error al guardar la promoción. Por favor, intenta nuevamente.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPromocion(prevPromocion => ({
            ...prevPromocion,
            [name]: name === 'tipoPromocion' ? value as TipoPromocion : value
        }));
    };

    return (
        <>
            <div className="container">
                <Link to="/promociones" className="btnVolver">
                    <img width={24} height={24} src={arrow_left} alt="arrow_left" />
                    <p style={{ margin: "0" }}>Volver</p>
                </Link>
                <form className="formContainer">
                    <label htmlFor="descripcionDescuento">Descripción de la promoción</label>
                    <input
                        type="text"
                        id="descripcionDescuento"
                        name="descripcionDescuento"
                        value={promocion.descripcionDescuento}
                        onChange={handleChange}
                    />

                    <label htmlFor="fechaDesde">Fecha Desde</label>
                    <input
                        type="date"
                        id="fechaDesde"
                        name="fechaDesde"
                        value={promocion.fechaDesde.toISOString().split('T')[0]} // Formatear la fecha para el input de tipo date
                        onChange={handleChange}
                    />

                    <label htmlFor="fechaHasta">Fecha Hasta</label>
                    <input
                        type="date"
                        id="fechaHasta"
                        name="fechaHasta"
                        value={promocion.fechaHasta.toISOString().split('T')[0]} // Formatear la fecha para el input de tipo date
                        onChange={handleChange}
                    />

                    <label htmlFor="horaDesde">Hora Desde</label>
                    <input
                        type="time"
                        id="horaDesde"
                        name="horaDesde"
                        value={promocion.horaDesde.toTimeString().slice(0, 5)} // Formatear la hora para el input de tipo time
                        onChange={handleChange}
                    />

                    <label htmlFor="horaHasta">Hora Hasta</label>
                    <input
                        type="time"
                        id="horaHasta"
                        name="horaHasta"
                        value={promocion.horaHasta.toTimeString().slice(0, 5)} // Formatear la hora para el input de tipo time
                        onChange={handleChange}
                    />

                    <label htmlFor="precioPromocional">Precio Promocional</label>
                    <input
                        type="number"
                        id="precioPromocional"
                        name="precioPromocional"
                        value={promocion.precioPromocional.toString()}
                        onChange={(e) => setPromocion({ ...promocion, precioPromocional: Number(e.target.value) })}
                    />

                    <label htmlFor="tipoPromocion">Tipo de Promoción</label>
                    <select
                        id="tipoPromocion"
                        name="tipoPromocion"
                        value={promocion.tipoPromocion}
                        onChange={handleChange}
                        style={{ marginBottom: 20, marginTop: 8 }}
                    >
                        {Object.values(TipoPromocion).map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>

                    <button type="button" className="btn btn-primary" onClick={savePromocion}>Guardar</button>
                </form>
            </div>
        </>
    )
}

export default SavePromocion
