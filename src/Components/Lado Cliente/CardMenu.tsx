import { CCard, CCardImage, CCardBody, CCardTitle, CCardText, CButton } from "@coreui/react"
import IArticuloManufacturado from "../../Entities/IArticuloManufacturado";

interface CardMenuProps {
    articulo: IArticuloManufacturado;
}

const CardMenu: React.FC<CardMenuProps> = ({ articulo }) => {

    const {imagenes, denominacion,descripcion} = articulo;

    return (
        <CCard style={{ width: '18rem' }}>
            <CCardImage orientation="top" src={'http://localhost:8080/imagenArticulos/uploads/' + imagenes[0].url } />
            <CCardBody>
                <CCardTitle>{denominacion}</CCardTitle>
                <CCardText>
                {descripcion}
                </CCardText>
                <CButton color="primary" href="#">Añadir item</CButton>
                <CButton color="primary" href="#">Eliminar item</CButton>
            </CCardBody>
        </CCard>
    )
}

export default CardMenu;