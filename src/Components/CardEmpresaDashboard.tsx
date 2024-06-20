import imagenEmpresa from "../assets/imagenes/empresa.jpg";
import deleteRed from "../assets/delete-red.svg";
import activeCyan from "../assets/checkmark-cyan-2.svg";
import IEmpresa from "../Entities/IEmpresa";

export default function CardEmpresaDashboard(props:{data:IEmpresa}) {
    return (
        <div className="cardEmpresa">
            <div>
                <img src={imagenEmpresa} alt={props.data.nombre} />
            </div>
            <div className="cardEmpresaBody">
                <div>
                    {
                        props.data.eliminado ? (
                            <div className="chip-default chip-delete">
                                <img width="24" height="24" src={deleteRed} alt="deleteRed" />
                                <div>Eliminado</div>
                            </div>
                        ) : (
                            <div className="chip-active chip-default">
                                <img width="24" height="24" src={activeCyan} alt="activeCyan" />
                                <div>Activo</div>
                            </div>
                        )
                    }
                    <p>{props.data.nombre}</p>
                </div>
                <div className="btnPropio btn-secondary-propio" style={{ width: "100%" }}>Ver sucursales</div>
            </div>
        </div>
    )
}