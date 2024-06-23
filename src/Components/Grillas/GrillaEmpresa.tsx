import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import IEmpresa from "../../Entities/IEmpresa";
import EmpresaService from "../../Functions/Services/EmpresaService";
import CardEmpresaDashboard from "../CardEmpresaDashboard";


export default function GrillaEmpresa() {

    const apiUrl = import.meta.env.VITE_URL_API_BACK
   

    const [empresas, setEmpresas] = useState<IEmpresa[]>([]);

    const mostrarDatos = (url: string) => {
        const result = new EmpresaService(url);
        result.getAll()
            .then(data => {
                setEmpresas(data);
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        mostrarDatos(`${apiUrl}empresas/includeDeleted`)
    }, [])
    return (
        <section className="containerColumn">

            {/* <Link to={'save/0'} className='btn btn-primary'>
                        <img src={masObject} alt="Crear Artículo" style={{ marginRight: '8px' }} />
                        Añadir empresa
            </Link> */}
            <div className="containerCardEmpresa">
                {
                    empresas && empresas.map((empresa: IEmpresa, key = empresa.id) => (
                        <CardEmpresaDashboard key={key} data={empresa}></CardEmpresaDashboard>
                    ))
                }
                <Link to={'save/0'} className="cardEmpresa cardEmpresaSave">
                    Agregar Empresa
                </Link>
            </div>
        </section>

    )
}
