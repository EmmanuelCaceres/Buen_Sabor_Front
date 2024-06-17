import { useEffect, useState } from "react"
import ISucursal from "../Entities/ISucursal"
import { useParams } from "react-router-dom"
import SucursalService from "../Functions/Services/SucursalService";
import { CCard, CCardBody, CCardTitle, CCardText, CListGroup, CListGroupItem, CCardLink } from "@coreui/react"

export default function Sucursales() {

    const { id } = useParams();

    const [sucursales, setSucursales] = useState<ISucursal[] | null>([])

    const getSucursalesByEmpresaId = async () => {
        const result = await new SucursalService("http://localhost:8080/sucursal/");
        result.getSucursalesById(Number(id))
            .then(data => {
                console.log(data)
                setSucursales(data);
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        getSucursalesByEmpresaId();
    }, [])

    return (
        <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap",gap:"3rem" }}>
            {
                sucursales?.map((sucursal: ISucursal) => (
                    <CCard style={{ width: '18rem' }}>
                        {/* <CCardImage orientation="top" src={ReactImg} /> */}
                        <CCardBody>
                            <CCardTitle>{sucursal.nombre}</CCardTitle>
                        </CCardBody>
                        <CListGroup flush>
                            <CListGroupItem>Domicilio: {sucursal.domicilio.calle} - {sucursal.domicilio.numero}</CListGroupItem>
                            <CListGroupItem>Localidad: {sucursal.domicilio.localidad.nombre} - {sucursal.domicilio.localidad.provincia.nombre}</CListGroupItem>
                            <CListGroupItem>Pais: {sucursal.domicilio.localidad.provincia.pais.nombre}</CListGroupItem>
                        </CListGroup>
                    </CCard>
                ))
            }
        </div>
    )
}