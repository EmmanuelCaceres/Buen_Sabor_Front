import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import IArticuloInsumo from "../Entities/IArticuloInsumo";
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import ArticuloInsumoService from "../Functions/Services/ArticuloInsumoService";
import ICategoria from "../Entities/ICategoria";
import IUnidadMedida from "../Entities/IUnidadMedida";
import UnidadMedidaService from "../Functions/Services/UnidadMedidaService";
import ImagenArticuloService from "../Functions/Services/ImagenArticuloService";
//import CategoriaService from "../Functions/Services/CategoriaService";
import SucursalService from "../Functions/Services/SucursalService";
import ISucursalDto from "../Entities/ISucursalDto";
import IEmpleado from "../Entities/IEmpleado";
import EmpleadoService from "../Functions/Services/EmpleadoService";
import ImagenPersonaService from "../Functions/Services/ImagenPersonaService";
import IRol from "../Entities/IRol";

export default function SaveEmpleado() {
    
    const [empleado,setEmpleado] = useState<IEmpleado>()

    


    return (
        <div className="container">
            <Link to="/panel-usuario/empleados" className="btnVolver">
                <img width={24} height={24} src={arrow_left} alt="arrow_left" />
                <p style={{ margin: "0" }}>Volver</p>
            </Link>
            <form action="">

            </form>
        </div>
    )
}