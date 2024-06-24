import { useEffect, useState } from "react";
import IPromocion from "../../Entities/IPromocion";
import PromocionService from "../../Functions/Services/PromocionService";
import { Link } from "react-router-dom";
/*import CardPromocionDashboard from "../CardPromocionDashboard";*/

export default function GrillaPromocion() {
    
    const apiUrl = import.meta.env.VITE_URL_API_BACK
   

    const [/*promociones*/, setPromociones] = useState<IPromocion[]>([]);

    const mostrarDatos = (url: string) => {
        const result = new PromocionService(url);
        result.getAll()
            .then(data => {
                setPromociones(data);
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        mostrarDatos(`${apiUrl}empresas/includeDeleted`)
    }, [apiUrl])

    return(
        <>
        <section className="containerColumn">

            {/* <Link to={'save/0'} className='btn btn-primary'>
                        <img src={masObject} alt="Crear Artículo" style={{ marginRight: '8px' }} />
                        Añadir empresa
            </Link> */}
            <div className="containerCardEmpresa">
                {/*
                    promociones && promociones.map((promocion: IPromocion, key = promocion.id) => (
                        /*<CardPromocionDashboard key={key} data={promocion}></CardPromocionDashboard>
                    ))*/
                }
                <Link to={'save/0'} className="cardEmpresa cardEmpresaSave">
                    Agregar Promoción
                </Link>
            </div>
        </section>
        </>
    )
}