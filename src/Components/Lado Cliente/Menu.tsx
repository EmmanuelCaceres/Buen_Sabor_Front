import { useEffect, useState } from "react";
import IArticuloManufacturado from "../../Entities/IArticuloManufacturado";
import ArticuloManufacturadoService from "../../Functions/Services/ArticuloManufacturadoService";
import IArticuloInsumo from "../../Entities/IArticuloInsumo.ts";
import ArticuloInsumoService from "../../Functions/Services/ArticuloInsumoService.ts";
import { CCard, CCardImage, CCardBody, CCardTitle, CCardText, CButton } from "@coreui/react"
import { useCarrito } from "./context/useCarrito.ts";
import { CarritoContextProvider } from "./context/CarritoContext.tsx";
import Carrito from "./Carrito.tsx";

export default function Menu(){

    const [articulosManufacturados, setArticulosManufacturados] = useState<IArticuloManufacturado[]>([]);

    const { addCarrito, removeItemCarrito } = useCarrito()

    const mostrarDatos =(url:string)=>{
        const result = new ArticuloManufacturadoService(url);
        result.getAll()
            .then(data =>{
                setArticulosManufacturados(data);
            })
            .catch(error =>{
                console.log(error)
            })
    }
    const [articulosInsumos, setArticulosinsumos] = useState<IArticuloInsumo[]>([]);

    const mostrarDatosInsumos =(url:string)=>{
        const result = new ArticuloInsumoService(url);
        result.getInsumoParaVentas()
            .then(data =>{
                setArticulosinsumos(data);
            })
            .catch(error =>{
                console.log(error)
            })
    }
    useEffect(()=>{
        mostrarDatos("http://localhost:8080/articuloManufacturados");
        mostrarDatosInsumos("http://localhost:8080/articuloInsumos/insumosParaVentas");
    },[])

    return(
        <div style={{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"row"}}>
            <div style={{width:"100%"}}>

            <div style={{display:"flex",flexDirection:"column"}}>
                <h2>Articulos manufacturados</h2>
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"1rem"}}>
                    {articulosManufacturados.map((articuloManufacturado:IArticuloManufacturado,index)=>(
                        <CCard key={index} style={{ width: '18rem' }}>
                        <CCardImage orientation="top" src={'http://localhost:8080/imagenArticulos/uploads/' +articuloManufacturado.imagenes[0].url } />
                        <CCardBody className="text-center">
                            <CCardTitle>{articuloManufacturado.denominacion}</CCardTitle>
                            <CCardText>
                            {articuloManufacturado.descripcion} - ${articuloManufacturado.precioVenta}
                            </CCardText>
                            <CButton color="primary" onClick={() => addCarrito(articuloManufacturado) }>Añadir item</CButton>
                            <CButton color="primary" onClick={() => removeItemCarrito(articuloManufacturado)}>Eliminar item</CButton>
                        </CCardBody>
                    </CCard>
                    ))
                    }
                </div>
            </div>
            <div>
                <h2>Insumos</h2>
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"1rem"}}>
                    {
                        articulosInsumos.map((articuloInsumo:IArticuloInsumo,index:number)=>(
                            <CCard key={index} style={{ width: '18rem' }}>
                        <CCardImage orientation="top" src={'http://localhost:8080/imagenArticulos/uploads/' +articuloInsumo.imagenes[0].url } />
                        <CCardBody className="text-center">
                            <CCardTitle>{articuloInsumo.denominacion}</CCardTitle>
                            <CCardText>
                            ${articuloInsumo.precioVenta}
                            </CCardText>
                            <CButton color="primary" onClick={() => addCarrito(articuloInsumo) }>Añadir item</CButton>
                            <CButton color="primary" onClick={() => removeItemCarrito(articuloInsumo)}>Eliminar item</CButton>
                        </CCardBody>
                    </CCard>
                        ))
                    }
                </div>
            </div>
            </div>
        <Carrito></Carrito>

        </div>
    )
}