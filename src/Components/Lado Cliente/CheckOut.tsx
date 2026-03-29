import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
//import IPedido from "../../Entities/IPedido";
//import IDetallePedido from "../../Entities/IDetallePedido";
//import IArticulo from "../../Entities/IArticulo";
//import IPromocion from "../../Entities/IPromocion";
import IDomicilio from "../../Entities/IDomicilio";
import {
  Estado,
  FormaPago,
  TipoEnvio,
  TipoDetalle,
} from "../../Entities/Enums";
import { clearCart } from "../../redux/slices/cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [idCliente, setIdCliente] = useState<number | null>(null);
  const { getAccessTokenSilently, user, isLoading: auth0Loading } = useAuth0();
  const [domiciliosCliente, setDomiciliosCliente] = useState<IDomicilio[]>([]);
  const [loading, setLoading] = useState(true);

  const { detalles, tipoEnvio: tipoEnvioRedux } = useSelector(
    (state: RootState) => state.cart,
  );
  const idSucursal = localStorage.getItem("selectedSucursalId");

  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio>(
    (tipoEnvioRedux as TipoEnvio) || TipoEnvio.TAKE_AWAY,
  );
  const [formaPago, setFormaPago] = useState<FormaPago>(FormaPago.EFECTIVO);
  const [domicilioSeleccionado, setDomicilioSeleccionado] = useState<
    number | null
  >(null);

  // Cálculos de totales (Sin descuentos)
  const total = detalles.reduce(
    (sum, item) => sum + item.productData.precioVenta * item.cantidad,
    0,
  );

  const handleConfirmarPedido = async () => {
    if (tipoEnvio === TipoEnvio.DELIVERY && !domicilioSeleccionado) {
      Swal.fire(
        "Error",
        "Por favor selecciona un domicilio para el envío",
        "error",
      );
      return;
    }

    try {
      const token = await getAccessTokenSilently();

      // 1. Crear el objeto del pedido
      const pedidoCreateDto = {
        estado: Estado.PENDIENTE,
        formaPago: formaPago,
        fechaPedido: new Date().toISOString().split("T")[0],
        tipoEnvio: tipoEnvio,
        clienteId: idCliente, // ID directo
        domicilioId:
          tipoEnvio === TipoEnvio.DELIVERY ? domicilioSeleccionado : null, // ID directo
        sucursalId: Number(idSucursal), // ID directo
        detalles: detalles.map((item) => ({
          cantidad: item.cantidad,
          tipo: item.tipo as TipoDetalle,
          articuloId:
            item.tipo === TipoDetalle.ARTICULO ? item.articuloId : null,
          promocionId:
            item.tipo === TipoDetalle.PROMOCION ? item.promocionId : null,
        })),
      };

      console.log("Enviando PedidoCreateDto:", pedidoCreateDto);

      const response = await fetch(`http://localhost:8080/pedidos/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pedidoCreateDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al procesar el pedido");
      }

      const pedidoGuardado = await response.json();

      // 3. Si es Mercado Pago, solicitar la preferencia
      if (formaPago === FormaPago.MERCADO_PAGO) {
        const resMP = await fetch(
          `http://localhost:8080/mercadoPago/preference_mp`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(pedidoGuardado),
          },
        );

        if (resMP.ok) {
          const preference = await resMP.json();
          const mpUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preference.id}`;

          // --- CAMBIOS AQUÍ ---

          // 1. Abrimos Mercado Pago en pestaña nueva
          window.open(mpUrl, "_blank", "noopener,noreferrer");

          // 2. Limpiamos el carrito en nuestra app (para que no quede el pedido ahí)
          dispatch(clearCart());

          // 3. Redirigimos la pestaña ACTUAL a "Mis Pedidos"
          // Así, cuando el usuario vuelva, ya está en su historial.
          navigate("/mis-pedidos");
        } else {
          throw new Error("Error al generar el pago de Mercado Pago");
        }
      } else {
        // 4. Si es efectivo, flujo normal
        Swal.fire(
          "¡Pedido Creado!",
          "Tu pedido ha sido registrado con éxito",
          "success",
        );
        dispatch(clearCart());
        navigate("/mis-pedidos");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  // ... (useEffect de fetchClienteYDomilios se mantiene igual)
  useEffect(() => {
    const fetchClienteYDomilios = async () => {
      if (auth0Loading || !user?.email) return;
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `http://localhost:8080/clientes/findByEmail?email=${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          const data = await response.json();
          const listaDom = data.domicilios || [];
          setDomiciliosCliente(listaDom);
          setIdCliente(data.id);
          if (listaDom.length > 0) setDomicilioSeleccionado(listaDom[0].id);
        }
      } catch (error) {
        console.error("Error en el fetch de domicilios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClienteYDomilios();
  }, [user, auth0Loading, getAccessTokenSilently]);

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">Finalizar Compra</h2>
      <div className="row">
        <div className="col-md-8">
          {/* Resumen */}
          <div className="card shadow-sm p-4 mb-4">
            <h4 className="mb-3">
              <i className="bi bi-cart3 me-2"></i>1. Resumen del Pedido
            </h4>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productData.denominacion}</td>
                      <td className="text-center">{item.cantidad}</td>
                      <td className="text-end">
                        $
                        {(
                          item.productData.precioVenta * item.cantidad
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Método de Entrega */}
          <div className="card shadow-sm p-4 mb-4">
            <h4 className="mb-3">
              <i className="bi bi-truck me-2"></i>2. Método de Entrega
            </h4>
            <div className="btn-group w-100 mb-3" role="group">
              <input
                type="radio"
                className="btn-check"
                name="envio"
                id="takeaway"
                checked={tipoEnvio === TipoEnvio.TAKE_AWAY}
                onChange={() => setTipoEnvio(TipoEnvio.TAKE_AWAY)}
              />
              <label className="btn btn-outline-primary" htmlFor="takeaway">
                Retiro en Local
              </label>

              <input
                type="radio"
                className="btn-check"
                name="envio"
                id="delivery"
                checked={tipoEnvio === TipoEnvio.DELIVERY}
                onChange={() => setTipoEnvio(TipoEnvio.DELIVERY)}
              />
              <label className="btn btn-outline-primary" htmlFor="delivery">
                Envío a Domicilio
              </label>
            </div>

            {tipoEnvio === TipoEnvio.DELIVERY && (
              <div className="mt-3 bg-light p-3 rounded">
                <h6>Selecciona tu dirección:</h6>
                {loading ? (
                  <div className="text-center py-2">
                    <div className="spinner-border spinner-border-sm text-primary"></div>
                  </div>
                ) : domiciliosCliente.length > 0 ? (
                  domiciliosCliente.map((dom) => (
                    <div key={dom.id} className="form-check border-bottom py-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="dom"
                        id={`dom-${dom.id}`}
                        checked={domicilioSeleccionado === dom.id}
                        onChange={() =>
                          setDomicilioSeleccionado(dom.id || null)
                        }
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor={`dom-${dom.id}`}
                      >
                        {dom.calle} {dom.numero}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-danger small">
                    No tienes domicilios registrados.{" "}
                    <button
                      className="btn btn-link btn-sm"
                      onClick={() => navigate("/perfil")}
                    >
                      Agregar uno
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Forma de Pago (Sin descuento en el label) */}
          <div className="card shadow-sm p-4 mb-4">
            <h4 className="mb-3">
              <i className="bi bi-credit-card me-2"></i>3. Forma de Pago
            </h4>
            <div className="row">
              <div className="col-md-6 mb-2">
                <div
                  className={`card p-3 border-2 ${formaPago === FormaPago.EFECTIVO ? "border-primary bg-light" : ""}`}
                  onClick={() => setFormaPago(FormaPago.EFECTIVO)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="pago"
                      checked={formaPago === FormaPago.EFECTIVO}
                      readOnly
                    />
                    <label className="form-check-label fw-bold">Efectivo</label>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-2">
                <div
                  className={`card p-3 border-2 ${formaPago === FormaPago.MERCADO_PAGO ? "border-primary bg-light" : ""}`}
                  onClick={() => setFormaPago(FormaPago.MERCADO_PAGO)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="pago"
                      checked={formaPago === FormaPago.MERCADO_PAGO}
                      readOnly
                    />
                    <label className="form-check-label fw-bold">
                      Mercado Pago
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen Lateral */}
        <div className="col-md-4">
          <div
            className="card shadow-sm p-4 sticky-top"
            style={{ top: "20px" }}
          >
            <h4 className="mb-3">Resumen Final</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Total a pagar</span>
              <span className="h5 text-primary">${total.toLocaleString()}</span>
            </div>
            <hr />
            <button
              className={`btn btn-lg w-100 ${formaPago === FormaPago.MERCADO_PAGO ? "btn-info text-white" : "btn-success"}`}
              onClick={handleConfirmarPedido}
              disabled={detalles.length === 0}
            >
              {formaPago === FormaPago.MERCADO_PAGO ? (
                <span>
                  <i className="bi bi-wallet2 me-2"></i>Ir a Mercado Pago
                </span>
              ) : (
                <span>Confirmar Pedido</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
