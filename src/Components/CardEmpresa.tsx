import { CCard, CCardBody, CCardTitle, CCardText, CButton } from "@coreui/react"
import { Link } from "react-router-dom"
import IEmpresa from "../Entities/IEmpresa"
export default function CardEmpresa(props:{ empresa:IEmpresa }) {

    return (
        <div>
            <CCard className="text-center" style={{ width: '18rem' }}>
                {/* <CCardImage orientation="top" src={ReactImg} /> */}
                <CCardBody>
                    <CCardTitle>{props.empresa.nombre}</CCardTitle>
                    <CCardText>
                        {props.empresa.razonSocial}
                    </CCardText>
                    <Link to={`../sucursales/${props.empresa.id}`}>
                    <CButton color="primary">Ver sucursales</CButton>
                    </Link>
                </CCardBody>
            </CCard>
        </div>
    )
}