import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import masObject from "../../assets/circle-plus-svgrepo-com.svg";
import IEmpleado from "../../Entities/IEmpleado";
import EmpleadoService from "../../Functions/Services/EmpleadoService";
import GrillaGenerica from "./GrillaGenerica";
import { InputSearch } from "../../Components";

export default function GrillaEmpleado() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;

    const [empleados, setEmpleados] = useState<IEmpleado[]>([]);

    const mostrarEmpleados = (url: string) => {
        const result = new EmpleadoService(url);
        result.getAll().then(data => {
            console.log(data);
            if (Array.isArray(data)) {
                setEmpleados(data);
            } else if ('content' in data && Array.isArray(data.content)) {
                setEmpleados(data.content);
            } else {
                setEmpleados([]);
            }
        }).catch(e => {
            console.error(e);
        })
    }
    const searchItem = (value: string) => {
        const result  =new EmpleadoService(`${apiUrl}empleados/filter?keyword=`);
        result.filterByKeyword(true,value)
        .then((data)=>{
            if (Array.isArray(data)) {
                setEmpleados(data);
            } else if ('content' in data && Array.isArray(data.content)) {
                setEmpleados(data.content);
            } else {
                setEmpleados([]);
            }
        })
        .catch((err)=>{
            console.error(err);
            
        })
    };

    useEffect(() => {
        mostrarEmpleados(`${apiUrl}empleados`)
    }, [apiUrl])

    return (
        <section className="container">
            <div className="d-flex justify-content-between align-items-center">
                <h1>Empleados</h1>
                <Link to={"/panel-usuario/empleados/save/0"} className="btn btn-primary">
                    <img src={masObject} alt="Crear Insumo" style={{ marginRight: "8px" }} />
                    Nuevo
                </Link>
            </div>
            <InputSearch label="Buscar empleados" customMethod={searchItem}/>
            <GrillaGenerica data={empleados} propertiesToShow={["nombre", "apellido"]} editItem={`/panel-usuario/empleados/save/`} />
        </section>
    )
}

