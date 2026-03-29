import React, { useEffect, useState } from "react";
import PedidoService from "../Functions/Services/PedidoService";
import IPedido from "../Entities/IPedido";
import { Estado } from "../Entities/Enums";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CBadge,
} from "@coreui/react";

const MonitorPedidos = () => {
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const sucursalId = 1; // Luego lo traeremos de un contexto global

  const fetchPedidos = async () => {
    try {
      // Usamos el endpoint por sucursal que ya tienes en el Controller
      const response = await fetch(
        `http://localhost:8080/pedidos/porSucursal/${sucursalId}`,
      );
      const data = await response.json();

      // LOG 1: Ver la respuesta cruda del servidor
      console.log("1. Datos crudos recibidos del servidor:", data);
      // Filtramos para no ver el historial viejo en el monitor
      const activos = data.content.filter(
        (p: IPedido) =>
          p.estado !== Estado.CANCELADO && p.estado !== Estado.ENTREGADO,
      );

      // LOG 2: Ver el primer pedido activo en detalle para inspeccionar al 'cliente'
      if (activos.length > 0) {
        console.log("2. Estructura del primer pedido activo:", activos[0]);
        console.log(
          "3. ¿Existe el nombre del cliente?:",
          activos[0].cliente?.nombre,
        );
      }

      setPedidos(activos);
    } catch (error) {
      console.error("Error cargando monitor:", error);
    }
  };

  useEffect(() => {
    fetchPedidos();
    // Tip de Pro: Podrías poner un setInterval aquí para que se actualice solo cada 30 seg.
  }, []);

  const handleCambioEstado = async (id: number, nuevoEstado: Estado) => {
    try {
      await PedidoService.cambiarEstado(id, { estado: nuevoEstado });
      fetchPedidos(); // Recargamos la lista
    } catch (error) {
      alert("No se pudo cambiar el estado");
    }
  };

  return (
    <div className="p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Monitor de Pedidos</h3>
        <CButton
          color="primary"
          variant="outline"
          size="sm"
          onClick={fetchPedidos}
        >
          🔄 Actualizar Lista
        </CButton>
      </div>

      <CRow>
        {pedidos.map((pedido) => (
          <CCol xs={12} md={6} lg={4} xl={4} key={pedido.id} className="mb-4">
            <CCard
              className="shadow-sm border-0"
              style={{ borderRadius: "15px", overflow: "hidden" }}
            >
              {/* Header Compacto */}
              <CCardHeader className="bg-white border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                <span className="fw-bold text-muted small">
                  ORDEN #{pedido.id}
                </span>
                <CBadge
                  color={
                    pedido.estado === Estado.PENDIENTE ? "warning" : "info"
                  }
                  shape="rounded-pill"
                  className="px-3 py-1"
                  style={{ fontSize: "0.7rem" }}
                >
                  {pedido.estado.replace("_", " ")}
                </CBadge>
              </CCardHeader>

              <CCardBody className="d-flex flex-column p-3">
                {/* Info Cliente y Tipo - Optimizada */}
                <div className="mb-3 border-bottom pb-2">
                  <div className="d-flex align-items-center mb-1">
                    <small
                      className="text-muted fw-bold me-2"
                      style={{ fontSize: "0.65rem", minWidth: "50px" }}
                    >
                      CLIENTE:
                    </small>
                    <span
                      className="fw-semibold text-dark"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {pedido.cliente?.nombre || "Consumidor Final"}
                    </span>
                  </div>

                  <div className="d-flex align-items-center">
                    <small
                      className="text-muted fw-bold me-2"
                      style={{ fontSize: "0.65rem", minWidth: "50px" }}
                    >
                      ENVÍO:
                    </small>
                    <CBadge
                      color={
                        pedido.tipoEnvio === "DELIVERY" ? "danger" : "success"
                      }
                      shape="rounded-pill"
                      className="px-2"
                      style={{ fontSize: "0.6rem", letterSpacing: "0.5px" }}
                    >
                      {pedido.tipoEnvio}
                    </CBadge>
                  </div>
                </div>

                {/* TICKET DE COCINA: Con scroll interno y altura controlada */}
                <div
                  className="flex-grow-1 p-3 bg-white border rounded-3 mb-3 shadow-sm"
                  style={{
                    minHeight: "150px",
                    maxHeight: "250px",
                    overflowY: "auto",
                    borderStyle: "dashed",
                    borderWidth: "2px",
                  }}
                >
                  <div className="d-flex justify-content-between border-bottom border-2 pb-1 mb-2">
                    <span
                      className="text-muted fw-bold"
                      style={{ fontSize: "0.65rem" }}
                    >
                      PRODUCTO
                    </span>
                    <span
                      className="text-muted fw-bold"
                      style={{ fontSize: "0.65rem" }}
                    >
                      SUBT.
                    </span>
                  </div>

                  {pedido.detallePedidos?.map((detalle, idx) => (
                    <div
                      key={idx}
                      className="d-flex justify-content-between mb-2 align-items-start"
                    >
                      <div
                        className="d-flex align-items-start"
                        style={{ maxWidth: "75%" }}
                      >
                        <span
                          className="fw-bold text-primary me-2"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {detalle.cantidad}x
                        </span>
                        <span
                          className="fw-medium text-dark lh-sm"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {detalle.articulo?.denominacion ||
                            detalle.promocion?.denominacion}
                        </span>
                      </div>
                      <span
                        className="fw-bold text-dark"
                        style={{ fontSize: "0.85rem" }}
                      >
                        ${Math.round(detalle.subTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total siempre visible abajo del ticket */}
                <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                  <span className="fw-bold text-muted small">
                    TOTAL A COBRAR
                  </span>
                  <span className="fw-bolder text-danger h4 mb-0">
                    ${pedido.total}
                  </span>
                </div>

                {/* Botones de Acción */}
                <div className="d-grid gap-2">
                  <CButton
                    color={
                      pedido.estado === Estado.PENDIENTE ? "primary" : "success"
                    }
                    className="text-white fw-bold py-2 shadow-sm border-0"
                    style={{ borderRadius: "8px" }}
                    onClick={() =>
                      handleCambioEstado(
                        pedido.id!,
                        pedido.estado === Estado.PENDIENTE
                          ? Estado.PREPARACION
                          : Estado.PENDIENTE_ENTREGA,
                      )
                    }
                  >
                    {pedido.estado === Estado.PENDIENTE
                      ? "🚀 Aceptar y Cocinar"
                      : "✅ Marcar como Listo"}
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  );
};

export default MonitorPedidos;
