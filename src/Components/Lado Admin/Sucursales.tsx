import { useEffect, useState } from "react"
import ISucursalDto from "../../Entities/ISucursalDto"
import SucursalService from "../../Functions/Services/SucursalService"
import useError from "../../Hooks/useError"
import { useParams } from "react-router-dom";
import SucursalComponent from "./SucursalComponent";

export default function Sucursales (){
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const {id} = useParams();
    const [sucursales,setSucursales] = useState<ISucursalDto[]>([])
    const errorState = useError();

    const mostrarDatos = (url:string)=>{
        const response = new SucursalService(url)
        response.getSucursalesByEmpresa(Number(id))
        .then(data=>{
            if(Array.isArray(data)) setSucursales(data);
        })
        .catch(error => {
            console.error('Error fetching empresas:', error);
            errorState.setError('Failed to fetch empresas');
        })
    }

    useEffect (()=>{
        mostrarDatos(`${apiUrl}sucursales/empresa/`);
        console.log(sucursales);
        
    },[apiUrl])

    const listaSucursales: React.JSX.Element[] = Array.isArray(sucursales)
        ? sucursales.map((sucursal)=><SucursalComponent sucursal={sucursal} key={sucursal.id}/>)
        : [];

    return(
        <div className="containerCard">
            {sucursales && sucursales.length > 0 ? (
                listaSucursales
                ) : (
                <div>
                    {
                        errorState.error
                    }
                </div>
                )}
        </div>
    )
}