import { useEffect, useState } from "react";
import IPromocion from "../../Entities/IPromocion";
import PromocionService from "../../Functions/Services/PromocionService";
import { Link } from "react-router-dom";
import { CardPromotion } from "../../Components";

export default function GrillaPromocion() {
    
    const apiUrl = import.meta.env.VITE_URL_API_BACK

    const [promociones, setPromociones] = useState<IPromocion[]>([]);

    const mostrarDatos = (url: string) => {
        const result = new PromocionService(url);
        result.getAll()
            .then(data => {
                console.log(data);
                if (Array.isArray(data)) {
                    setPromociones(data);
                } else if ('content' in data && Array.isArray(data.content)) {
                    setPromociones(data.content);
                } else {
                    setPromociones([]);
                }
            })
            .catch(error => {
                console.log(error)
            })

    }

    useEffect(() => {
        mostrarDatos(`${apiUrl}promociones`)
        console.log(promociones);
        
    }, [apiUrl])

    return(
        <section className="containerCardEmpresa">
            {/* {promociones && promociones.map((promocion: IPromocion) => (
                <CardPromotion key={promocion.id} promocion={promocion}/>
            ))} */}
            <Link to={'save/0'} className="cardEmpresa cardEmpresaSave">
                Agregar Promoción
            </Link>
        </section>
    )
}