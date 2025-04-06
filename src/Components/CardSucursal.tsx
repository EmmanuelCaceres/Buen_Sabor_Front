import { CCard, CCardBody, CCardTitle, CCardText, CButton } from "@coreui/react"
import { Link } from "react-router-dom"
import ISucursalDto from "../Entities/ISucursalDto"
export default function CardSucursal(props:{ sucursal:ISucursalDto }) {

    return (
        <div>
            <CCard className="text-center" style={{ width: '18rem' }}>
                {/* <CCardImage orientation="top" src={ReactImg} /> */}
                <CCardBody>
                    <CCardTitle>{props.sucursal.nombre}</CCardTitle>
                    <CCardText>
                        {props.sucursal.empresa.razonSocial}
                    </CCardText>
                    <Link to={`../sucursales/${props.sucursal.id}`}>
                    <CButton color="primary">Ver sucursales</CButton>
                    </Link>
                </CCardBody>
            </CCard>
        </div>
    )
}