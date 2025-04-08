import IPromocion from "../../Entities/IPromocion";
import "./CardPromotion.css"
import {Link} from "react-router-dom"

interface props{
    promocion: IPromocion
}

export const CardPromotion = ({promocion}:props) => {
    return (
        <div className="card">
            <div >
                <img src={promocion.imagenes[0].url} alt={String(promocion.id)} />
            </div>
            <p style={{margin:"0"}}>{promocion.denominacion}</p>
            <Link to={`save/${promocion.id}`}>Editar</Link>
        </div>
    );
}