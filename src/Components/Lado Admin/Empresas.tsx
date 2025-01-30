import { useEffect, useState } from "react"
import React from "react";
import IEmpresaDto from "../../Entities/IEmpresa"
import EmpresaService from "../../Functions/Services/EmpresaService";
import EmpresaComponent from "./EmpresaComponent";
import { IPaginatedResponse } from "../../Entities/IPaginatedResponse";



export default function Empresas(){
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const [empresas,setEmpresas] = useState<IEmpresaDto[] | IPaginatedResponse<IEmpresaDto>>([]);
    const [error,setError] = useState<string | null>(null);

    const mostrarDatos =(url:string)=>{
        const response = new EmpresaService(url);
        response.getAll()
            .then(data=>{
                console.log('Data fetched successfully:', data);
                // Validamos si el valor que devuelve el metodo getAll es un arreglo de tipo IEmpresaDto o es un arreglo dentro de IPaginatedResponse
                if(Array.isArray(data)){
                    setEmpresas(data);
                }else if ('data' in data) { 
                    setEmpresas(data.content); 
                }
            }).catch(error => {
                console.error('Error fetching empresas:', error);
                setError('Failed to fetch empresas');
            })
    }

    useEffect(()=>{
        mostrarDatos(`${apiUrl}empresas`);
    },[apiUrl])

    //Devuelve una lista de elementos HTML para renderizar
    const empresasList: React.JSX.Element[] = Array.isArray(empresas)
        ? empresas.map((empresa) => <EmpresaComponent empresa={empresa} key={empresa.id} />)
        : [];

        return(
            <div className="inicioLogin">
                {empresas ? 
                    empresasList:
                    <div>
                        {error}
                    </div>
                }
            </div>
        )

        
}