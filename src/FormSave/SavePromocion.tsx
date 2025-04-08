import React, { useState } from 'react'
import IPromocion from '../Entities/IPromocion';
import PromocionService from '../Functions/Services/PromocionService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TipoPromocion } from '../Entities/TipoPromocion';
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import "./SavePromocion.css"
import { CustomSelect } from '../Components/CustomSelect/CustomSelect';
import IArticuloManufacturado from '../Entities/IArticuloManufacturado';

const SavePromocion = () => {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const { id } = useParams();
    const navigate = useNavigate();
    const [promocion,setPromocion] = useState<IPromocion>();
    const [articuloManufacturado, setArticuloManufacturado] = useState<IArticuloManufacturado[]>([]);

    function addArticuloManufacturado(articulo: IArticuloManufacturado) {
        
    }
    
    // const savePromocion = async () => {
    //     try {
    //         if (promocion.id !== 0) {
    //             await new PromocionService(`${apiUrl}promociones`).put(promocion.id, promocion);
    //         } else {
    //             await new PromocionService(`${apiUrl}promociones`).post(promocion);
    //         }
    //         alert("¡Promoción guardada con éxito!");
    //         navigate(-1); // Redirigir a la página anterior
    //     } catch (error) {
    //         console.error('Error al guardar la promoción:', error);
    //         alert("Hubo un error al guardar la promoción. Por favor, intenta nuevamente.");
    //     }
    // };




    return (
        <>
            <div className='container'>
            <Link to="/panel-usuario/promociones" className="btnVolver">
                    <img width={24} height={24} src={arrow_left} alt="arrow_left" />
                    <p style={{ margin: "0" }}>Volver</p>
                </Link>
                <form action="" className='formProm'>
                    <div>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                        />
                    </div>
                    <div>
                        <label htmlFor="denominacion">Denominacion</label>
                        <input
                            type="text"
                            id="denominacion"
                            name="denominacion"
                        />
                    </div>
                    <div>
                        <label htmlFor="promPrice">Precio promocional</label>
                        <input
                            type="number"
                            id="promPrice"
                            name="promPrice"
                        />
                    </div>
                    <div>
                        <label htmlFor="tipoPromocion">Tipo de promoción</label>
                        <CustomSelect options={articuloManufacturado} valorSeleccionado='' onChange={addArticuloManufacturado}/>
                    </div>
                    <input type="file" />
                </form>
            </div>
        </>
    )
}

export default SavePromocion
