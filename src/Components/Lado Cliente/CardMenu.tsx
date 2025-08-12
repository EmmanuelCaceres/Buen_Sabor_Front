import { CCard, CCardImage, CCardBody, CCardTitle, CCardText, CButton } from "@coreui/react";
import IArticuloManufacturado from "../../Entities/IArticuloManufacturado";
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/slices/cartSlice';

interface CardMenuProps {
    articulo: IArticuloManufacturado;
}

const CardMenu: React.FC<CardMenuProps> = ({ articulo }) => {
    const dispatch = useDispatch();
    const { imagenes, denominacion, descripcion } = articulo;

    const handleAddItem = () => {
        dispatch(addItem({ 
            id: articulo.id, 
            tipo: 'ARTICULO',
            productData: articulo 
        }));
    };

    return (
        <CCard style={{ width: '18rem' }}>
            <CCardImage orientation="top" src={'http://localhost:8080/imagenArticulos/uploads/' + imagenes[0].url} />
            <CCardBody>
                <CCardTitle>{denominacion}</CCardTitle>
                <CCardText>
                    {descripcion}
                </CCardText>
                <CButton color="primary" onClick={handleAddItem}>Añadir al carrito</CButton>
            </CCardBody>
        </CCard>
    )
}

export default CardMenu;