import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import ISucursalDto from "../../Entities/ISucursalDto";
import SucursalService from "../../Functions/Services/SucursalService";
import CardSucursalDashboard from "../CardSucursalDashboard";

export default function GrillaSucursal() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;

    const [sucursales, setSucursales] = useState<ISucursalDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    const mostrarDatos = (url: string) => {
        console.log('Starting data fetch...');
        const result = new SucursalService(url);
        result.getAll(true)
            .then(data => {
                if ("content" in data) {
                    setSucursales(data.content); // ✅ así estás seguro
                } else {
                    setSucursales(data); // por si alguna vez te devuelven T[] (aunque parece que no)
                }
            })
            .catch(error => {
                console.error('Error fetching sucursales:', error);
                setError('Failed to fetch sucursales');
            });
    }

    useEffect(() => {
        mostrarDatos(`${apiUrl}sucursales/includeDeleted`);
    }, [apiUrl]);

    return (
        <section className="containerColumn">
            {error && <p className="error-message">{error}</p>}
            <div className="containerCardEmpresa">
                {sucursales && sucursales.map((sucursal: ISucursalDto) => (
                    <CardSucursalDashboard key={sucursal.id} data={sucursal}></CardSucursalDashboard>
                ))}
                <Link to={'save/0'} className="cardSucursal cardSucursalSave">
                    Agregar Sucursal
                </Link>
            </div>
        </section>
    );
}
