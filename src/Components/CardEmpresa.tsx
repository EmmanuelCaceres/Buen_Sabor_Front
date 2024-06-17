import { CCard, CCardBody, CCardTitle, CCardText, CButton } from "@coreui/react"
import { Link } from "react-router-dom"
export default function CardEmpresa({ empresa }) {


    return (
        <div>
            <CCard className="text-center" style={{ width: '18rem' }}>
                {/* <CCardImage orientation="top" src={ReactImg} /> */}
                <CCardBody>
                    <CCardTitle>{empresa.nombre}</CCardTitle>
                    <CCardText>
                        {empresa.razonSocial}
                    </CCardText>
                    <Link to={`../sucursales/${empresa.id}`}>
                    <CButton color="primary">Ver sucursales</CButton>
                    </Link>
                </CCardBody>
            </CCard>
        </div>
    )
}