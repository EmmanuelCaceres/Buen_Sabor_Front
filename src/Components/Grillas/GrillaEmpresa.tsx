import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import IEmpresa from "../../Entities/IEmpresa";
import EmpresaService from "../../Functions/Services/EmpresaService";
import CardEmpresaDashboard from "../CardEmpresaDashboard";

export default function GrillaEmpresa() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;

    const [empresas, setEmpresas] = useState<IEmpresa[]>([]);
    const [error, setError] = useState<string | null>(null);

    const mostrarDatos = (url: string) => {
        console.log('Starting data fetch...');
        const result = new EmpresaService(url);
        result.getAll()
            .then(data => {
                console.log('Data fetched successfully:', data);
                setEmpresas(data);
            })
            .catch(error => {
                console.error('Error fetching empresas:', error);
                setError('Failed to fetch empresas');
            });
    }

    useEffect(() => {
        mostrarDatos(`${apiUrl}empresas/includeDeleted`);
    }, [apiUrl]);

    return (
        <section className="containerColumn">
            {error && <p className="error-message">{error}</p>}
            <div className="containerCardEmpresa">
                {empresas && empresas.map((empresa: IEmpresa) => (
                    <CardEmpresaDashboard key={empresa.id} data={empresa}></CardEmpresaDashboard>
                ))}
                <Link to={'save/0'} className="cardEmpresa cardEmpresaSave">
                    Agregar Empresa
                </Link>
            </div>
        </section>
    );
}
