import { Link, useNavigate, useParams } from "react-router-dom";
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import EmpresaService from "../Functions/Services/EmpresaService";
import { useState, useEffect } from "react";
import IEmpresa from "../Entities/IEmpresa";

export default function SaveSucursal() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;

    const { id } = useParams();
    const navigate = useNavigate();

    const [empresa, setEmpresa] = useState<IEmpresa>({
        id: Number(id),
        baja: false,
        nombre: "",
        razonSocial: "",
        cuil: ""
    });

    useEffect(() => {
        if (Number(id) !== 0) {
            new EmpresaService(`${apiUrl}/empresas`).get(Number(id))
                .then(data => setEmpresa(data))
                .catch(error => console.error("Error al cargar la empresa:", error));
        }
    }, [id, apiUrl]);

    const SaveEmpresa = async () => {
        try {
            if (Number(id) !== 0) {
                await new EmpresaService(`${apiUrl}/empresas`).put(Number(id), empresa);
            } else {
                await new EmpresaService(`${apiUrl}/empresas`).post(empresa);
            }
            alert("Empresa guardada con éxito!");
            navigate(-1);
        } catch (error) {
            console.error("Error al guardar la empresa:", error);
            alert("Error al guardar la empresa.");
        }
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
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={empresa.nombre}
                        onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })}
                    />
                    <label htmlFor="razonSoc">Razón social</label>
                    <input
                        type="text"
                        id="razonSoc"
                        name="razonSoc"
                        value={empresa.razonSocial}
                        onChange={(e) => setEmpresa({ ...empresa, razonSocial: e.target.value })}
                    />
                    <label htmlFor="cuil">CUIL</label>
                    <input
                        type="text"
                        id="cuil"
                        name="cuil"
                        value={empresa.cuil}
                        onChange={(e) => setEmpresa({ ...empresa, cuil: e.target.value })}
                    />
                </form>

                <button className="btn btn-primary" onClick={SaveEmpresa}>Guardar</button>
            </div>
        </>
    );
}
