import { Link } from "react-router-dom"
import IEmpresaDto from "../../Entities/IEmpresa"

export default function EmpresaComponent ({empresa}:{empresa:IEmpresaDto}){
    return(
        <Link to={`/empresa/${empresa.id}`} className="cardEmpresa ">
            <img width={100} height={100} src="" alt="" />
            <h2>{empresa.nombre}</h2>
            <p>{empresa.razonSocial}</p>
        </Link>
    )
}