import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { removeItem, decrementQuantity, clearCart, addItem, setOpcionPedido } from '../../redux/slices/cartSlice';
import PedidoService from '../../Functions/Services/PedidoService';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardTitle, CButton, CListGroup, CListGroupItem, CFormCheck, CCardText } from '@coreui/react';
import './Carrito.css';

const ItemCarrito = ({ item, onRemove, onIncrement, onDecrement }) => {
    const { productData, cantidad, tipo } = item;
    const imageUrl = productData.imagenes?.[0]?.url
        ? `http://localhost:8080/imagenArticulos/uploads/${productData.imagenes[0].url}`
        : 'https://via.placeholder.com/150';

    return (
        <CCard className="mb-3 cart-item-card">
            <CCardBody>
                <CRow className="align-items-center">
                    <CCol xs="3" md="2">
                        <img src={imageUrl} alt={productData.denominacion} className="img-fluid rounded" />
                    </CCol>
                    <CCol xs="9" md="5">
                        <h5 className="mb-0">{productData.denominacion}</h5>
                        <p className="text-muted small mb-0">{tipo}</p>
                    </CCol>
                    <CCol xs="8" md="3" className="d-flex justify-content-center align-items-center mt-3 mt-md-0">
                        <div className="quantity-controls d-flex align-items-center">
                            <CButton color="secondary" variant="outline" onClick={onDecrement}>-</CButton>
                            <span className="quantity-display">{cantidad}</span>
                            <CButton color="secondary" variant="outline" onClick={onIncrement}>+</CButton>
                        </div>
                    </CCol>
                    <CCol xs="4" md="2" className="text-end mt-3 mt-md-0">
                        <p className="fw-bold mb-0">${(productData.precioVenta * cantidad).toFixed(2)}</p>
                        <CButton onClick={onRemove} className="remove-btn p-0 mt-1">
                           Quitar
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    );
};

const CarritoVacio = () => (
    <div className="empty-cart-container">
        <div className="empty-cart-icon">🛒</div>
        <h2 className="mt-3">Tu carrito está vacío</h2>
        <p className="text-muted">Parece que todavía no has añadido ningún producto.</p>
    </div>
);

// --- MAIN COMPONENT ---

export default function Carrito() {
    const dispatch = useDispatch();
    const { detalles, formaPago, tipoEnvio, sucursalId } = useSelector((state: RootState) => state.cart);

    const totalPedido = detalles.reduce((total, item) => total + (item.productData.precioVenta * item.cantidad), 0);

    const handleCheckout = async () => {
        const selectedSucursalId = sucursalId || 2; // Por defecto la sucursal es 2 si no se selecciona una
        if (!selectedSucursalId) {
            alert("Por favor, seleccione una sucursal.");
            return;
        }

        const detallesPedido = detalles.map(item => ({
            cantidad: item.cantidad, tipo: item.tipo, articuloId: item.articuloId, promocionId: item.promocionId, baja: false, id: 0
        }));

        const pedido = {
            id: 0, baja: false, estado: "PREPARACION", formaPago, fechaPedido: new Date().toISOString().split('T')[0],
            tipoEnvio, clienteId: 1, domicilioId: 1, sucursalId: selectedSucursalId, detalles: detallesPedido
        };

        console.log("Pedido a enviar:", pedido);
        // const pedidoService = new PedidoService("http://localhost:8080/pedido");
        // try {
        //     const data = await pedidoService.PostPedidoData(pedido);
        //     alert(`Pedido #${data.id} realizado con éxito!`);
        //     dispatch(clearCart());
        // } catch (error) {
        //     console.error("Error al procesar el pedido:", error);
        //     alert("Hubo un error al procesar su pedido.");
        // }
    };

    if (detalles.length === 0) {
        return <CarritoVacio />;
    }

    return (
        <CContainer className="cart-container">
            <CCol>
                <CCol>
                    {detalles.map((item) => {
                        const identifier = { id: item.articuloId || item.promocionId!, tipo: item.tipo };
                        return (
                            <ItemCarrito
                                key={`${item.tipo}-${identifier.id}`}
                                item={item}
                                onRemove={() => dispatch(removeItem(identifier))}
                                onIncrement={() => dispatch(addItem({ ...item, id: identifier.id, productData: item.productData }))}
                                onDecrement={() => dispatch(decrementQuantity(identifier))}
                            />
                        )
                    })}
                </CCol>
                <CCol>
                    <CCard className="summary-card">
                        <CCardBody>
                            <CCardTitle as="h3">Resumen del Pedido</CCardTitle>
                            <CListGroup flush>
                                <CListGroupItem className="d-flex justify-content-between align-items-center">
                                    Subtotal
                                    <span>${totalPedido.toFixed(2)}</span>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <CCardText as="div" className="mb-2 fw-bold">Tipo de Envío</CCardText>
                                    <CFormCheck type="radio" name="tipoEnvio" id="delivery" label="Delivery" value="DELIVERY" checked={tipoEnvio === 'DELIVERY'} onChange={() => dispatch(setOpcionPedido({ tipoEnvio: 'DELIVERY' }))} />
                                    <CFormCheck type="radio" name="tipoEnvio" id="takeaway" label="Take Away" value="TAKE_AWAY" checked={tipoEnvio === 'TAKE_AWAY'} onChange={() => dispatch(setOpcionPedido({ tipoEnvio: 'TAKE_AWAY' }))} />
                                </CListGroupItem>
                                <CListGroupItem>
                                    <CCardText as="div" className="mb-2 fw-bold">Forma de Pago</CCardText>
                                    <CFormCheck type="radio" name="formaPago" id="efectivo" label="Efectivo" value="EFECTIVO" checked={formaPago === 'EFECTIVO'} onChange={() => dispatch(setOpcionPedido({ formaPago: 'EFECTIVO' }))} />
                                    <CFormCheck type="radio" name="formaPago" id="mp" label="Mercado Pago" value="MERCADO_PAGO" checked={formaPago === 'MERCADO_PAGO'} onChange={() => dispatch(setOpcionPedido({ formaPago: 'MERCADO_PAGO' }))} />
                                </CListGroupItem>
                                <CListGroupItem className="d-flex justify-content-between align-items-center fw-bold fs-5">
                                    Total
                                    <span>${totalPedido.toFixed(2)}</span>
                                </CListGroupItem>
                            </CListGroup>
                            <div className="d-grid gap-2 mt-4">
                                <CButton color="success" size="lg" onClick={handleCheckout}>Finalizar Compra</CButton>
                                <CButton color="danger" variant="outline" onClick={() => dispatch(clearCart())}>Vaciar Carrito</CButton>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CCol>
        </CContainer>
    );
}