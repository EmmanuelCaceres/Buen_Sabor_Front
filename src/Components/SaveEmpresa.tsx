import { Link, useNavigate, useParams } from "react-router-dom";
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import EmpresaService from "../Functions/Services/EmpresaService";
import { useState } from "react";
import IEmpresa from "../Entities/IEmpresa";

export default function SaveEmpresa() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [empresa, setEmpresa] = useState<IEmpresa>({
        id: Number(id),
        eliminado: false,
        nombre: "",
        razonSocial: "",
        cuil: 0,
        sucursales: []
    });

    const SaveCategoria = async () => {
        if (Number(id) !== 0) {
            await new EmpresaService("http://localhost:8080/empresa").put(Number(id), empresa);
        } else {
            await new EmpresaService("http://localhost:8080/empresa").post(empresa);
        }
        alert("Empresa guardada con exito!");
        // handleClose(false);
        navigate(-1);
    };



    return (
        <>
            <div className="container">
                <Link to="/empresas" className="btnVolver">
                    <img width={24} height={24} src={arrow_left} alt="arrow_left" />
                    <p style={{ margin: "0" }}>Volver</p>
                </Link>
                <form action="" className="formContainer">
                    <label htmlFor="nombre">Nombre de la empresa</label>
                    <input type="text" id="nombre" name="nombre" value={empresa.nombre} onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })} />
                    <label htmlFor="razonSoc">Razon social</label>
                    <input type="text" id="razonSoc" name="razonSoc" value={empresa.razonSocial} onChange={(e) => setEmpresa({ ...empresa, razonSocial: e.target.value })} />
                    <label htmlFor="cuil">Cuil</label>
                    <input type="number" id="cuil" name="cuil" value={empresa.cuil} onChange={(e) => setEmpresa({ ...empresa, cuil: Number(e.target.value) })} />
                </form>

                <button className="btn btn-primary" onClick={SaveCategoria}>Guardar</button>
            </div>
        </>
    )
}