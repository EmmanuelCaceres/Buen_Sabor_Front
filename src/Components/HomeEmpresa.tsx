import IEmpresa from "../Entities/IEmpresa";
import { useEffect, useState } from "react";
import EmpresaService from "../Functions/Services/EmpresaService";
import CardEmpresa from "./CardEmpresa";

export default function HomeEmpresa(){

    const [empresas,setEmpresas] = useState<IEmpresa[]>([]);

    const getAllEmpresas = async () =>{

        const result = await new EmpresaService("http://localhost:8080/empresa");
        result.getAll()
            .then(data =>{
                setEmpresas(data);
            })
            .catch(error =>{
                console.log(error)
            })

    }

    useEffect(()=>{
        getAllEmpresas();
    },[])


    return(
        <div style={{height:"100vh",width:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>
            {
                empresas.map((empresa:IEmpresa)=>(
                    <CardEmpresa key={empresa.id} empresa={{id:empresa.id, cuil:empresa.cuil, nombre:empresa.nombre, razonSocial:empresa.razonSocial}}></CardEmpresa>
                ))
            }
        </div>
    )
}