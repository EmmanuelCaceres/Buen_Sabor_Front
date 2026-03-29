import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom"; // 1. Importar
import {
  decrementQuantity,
  clearCart,
  addItem,
  toggleCartVisibility,
} from "../../redux/slices/cartSlice";
import {
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  COffcanvasBody,
  CButton,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";
import imagenPorDefecto from "../../assets/imagenes/empresa.jpg";
import "./Carrito.css";

export default function Carrito() {
  const navigate = useNavigate(); // 2. Inicializar
  const dispatch = useDispatch();
  const { detalles, isCartVisible } = useSelector(
    (state: RootState) => state.cart,
  );
  const idSucursal = localStorage.getItem("selectedSucursalId");

  const totalPedido = detalles.reduce(
    (total, item) => total + item.productData.precioVenta * item.cantidad,
    0,
  );

  const handleCheckout = async () => {
    if (!idSucursal) {
      alert("Por favor, selecciona una sucursal primero.");
      return;
    }
    // 3. Cerramos el carrito para que no estorbe en la navegación
    dispatch(toggleCartVisibility());

    // 4. Navegamos a la pantalla de Checkout
    navigate("/checkout");
    // Aquí va tu lógica de POST pedido que ya tienes armada
    console.log("Procesando pedido para sucursal:", idSucursal);
  };

  return (
    <COffcanvas
      placement="end"
      visible={isCartVisible}
      onHide={() => dispatch(toggleCartVisibility())}
    >
      <COffcanvasHeader className="border-bottom">
        <COffcanvasTitle className="fw-bold">🛒 Tu Pedido</COffcanvasTitle>
        <CButton
          variant="ghost"
          onClick={() => dispatch(toggleCartVisibility())}
        >
          X
        </CButton>
      </COffcanvasHeader>

      <COffcanvasBody className="d-flex flex-column">
        {detalles.length === 0 ? (
          <div className="text-center mt-5">
            <p className="fs-1">🍕</p>
            <h5>¡Tu carrito está vacío!</h5>
            <p className="text-muted">Agrega algo rico para empezar.</p>
          </div>
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto mb-3">
              <CListGroup flush>
                {detalles.map((item) => (
                  <CListGroupItem
                    key={`${item.tipo}-${item.articuloId || item.promocionId}`}
                    className="px-0 py-3"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={
                          item.productData.imagenes?.[0]?.url ||
                          imagenPorDefecto
                        }
                        alt={item.productData.denominacion}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6
                          className="mb-0 text-truncate"
                          style={{ maxWidth: "150px" }}
                        >
                          {item.productData.denominacion}
                        </h6>
                        <small className="text-muted">
                          ${item.productData.precioVenta.toLocaleString()}
                        </small>
                      </div>
                      <div className="d-flex align-items-center border rounded">
                        <CButton
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            dispatch(
                              decrementQuantity({
                                id: item.articuloId || item.promocionId!,
                                tipo: item.tipo,
                              }),
                            )
                          }
                        >
                          -
                        </CButton>
                        <span className="px-2">{item.cantidad}</span>
                        <CButton
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            dispatch(
                              addItem({
                                ...item,
                                id: item.articuloId || item.promocionId!,
                                productData: item.productData, // Lo pasamos explícitamente
                              }),
                            )
                          }
                        >
                          +
                        </CButton>
                      </div>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </div>

            <div className="border-top pt-3 bg-light p-3 rounded">          
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold fs-5">Total:</span>
                <span className="fw-bold fs-5 text-success">
                  ${totalPedido.toLocaleString()}
                </span>
              </div>

              <div className="d-grid gap-2">
                <CButton
                  color="warning"
                  size="lg"
                  className="text-white fw-bold"
                  onClick={handleCheckout}
                >
                  CONTINUAR COMPRA
                </CButton>
                <CButton
                  color="link"
                  size="sm"
                  className="text-danger"
                  onClick={() => dispatch(clearCart())}
                >
                  Vaciar carrito
                </CButton>
              </div>
            </div>
          </>
        )}
      </COffcanvasBody>
    </COffcanvas>
  );
}
