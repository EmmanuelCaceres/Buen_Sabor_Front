import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import masObject from '../assets/circle-plus-svgrepo-com.svg';
import IEmpresa from "../Entities/IEmpresa";
import EmpresaService from "../Functions/Services/EmpresaService";
import CardEmpresaDashboard from "./CardEmpresaDashboard";

export default function GrillaEmpresa() {

    const [empresas, setEmpresas] = useState<IEmpresa[]>([]);

    const mostrarDatos = (url: string) => {
        const result = new EmpresaService(url);
        result.getAll()
            .then(data => {
                console.log(data);
                setEmpresas(data);
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        mostrarDatos("http://localhost:8080/empresas/includeDeleted")
    }, [])
    return (
        <section className="containerColumn">
            
            <Link to={'save/0'} className='btn btn-primary'>
                        <img src={masObject} alt="Crear Artículo" style={{ marginRight: '8px' }} />
                        Añadir empresa
            </Link>
            <div className="containerCardEmpresa">
                {
                   empresas && empresas.map((empresa: IEmpresa,key=empresa.id) => (
                        <CardEmpresaDashboard key={key} data={empresa}></CardEmpresaDashboard>
                    ))
                }
            </div>
        </section>

    )
}
