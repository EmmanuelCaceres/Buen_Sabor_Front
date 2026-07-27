import React, { useEffect, useState } from "react";
import PedidoService from "../Functions/Services/PedidoService";
import IPedido from "../Entities/IPedido";
import { Estado } from "../Entities/Enums";
import { useRol } from "../context/RolContext";
import { useSucursal } from "../context/SucursalContext";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CBadge,
  CModalBody,
  CModal,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import IArticuloManufacturado from "../Entities/IArticuloManufacturado";
import IPromocion from "../Entities/IPromocion";
import { IPromocionDetalle } from "../Entities/IPromocionDetalle";

const MonitorPedidos = () => {
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const { rol } = useRol();
  const { sucursalId } = useSucursal();
  const rolUsuario = rol || "COCINERO";
  const [showModal, setShowModal] = useState(false);
  // Agregamos "| null" para que acepte el valor inicial
  const [articuloSeleccionado, setArticuloSeleccionado] =
    useState<IArticuloManufacturado | null>(null);
  const [promoSeleccionada, setPromoSeleccionada] = useState<IPromocion | null>(
    null,
  );
  const fetchPedidos = async () => {
    if (!sucursalId) return; // 🛑 Evita llamadas a la API si no hay sucursal cargada
    try {
      const response = await fetch(
        `http://localhost:8080/pedidos/porSucursal/${sucursalId}`,
      );
      const data = await response.json();

      // --- DIAGNÓSTICO: Ver qué llega del servidor ---
      if (data.content && data.content.length > 0) {
        const primerPedido = data.content[0];
        console.log("📦 ESTRUCTURA DEL PEDIDO:", primerPedido);

        if (primerPedido.detallePedidos?.length > 0) {
          console.log(
            "🍔 PRIMER ARTÍCULO:",
            primerPedido.detallePedidos[0].articulo,
          );
        }
      }
      // -----------------------------------------------

      const activos = data.content.filter((p: IPedido) => {
        // Lógica de filtrado por ROL
        if (rolUsuario === "COCINERO") {
          return p.estado === Estado.PREPARACION; // El cocinero solo ve lo que tiene que cocinar
        }
        // El cajero ve todo lo pendiente de entrega o cocción
        return p.estado !== Estado.CANCELADO && p.estado !== Estado.ENTREGADO;
      });

      const ordenados = activos.sort((a: IPedido, b: IPedido) => b.id! - a.id!);
      setPedidos(ordenados);
    } catch (error) {
      console.error("Error cargando monitor:", error);
    }
  };

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 30000);
    return () => clearInterval(interval);
  }, [rolUsuario, sucursalId]); // 👈 Agregamos sucursalId acá // Recargar si cambia el rol

  const handleCambioEstado = async (id: number, nuevoEstado: Estado) => {
    if (nuevoEstado === Estado.CANCELADO) {
      if (!window.confirm("¿Estás seguro de que deseas cancelar este pedido?"))
        return;
    }

    try {
      await PedidoService.cambiarEstado(id, { estado: nuevoEstado });
      fetchPedidos();
    } catch (error) {
      alert("No se pudo actualizar el estado");
    }
  };

  const getBotonConfig = (estado: Estado) => {
    switch (estado) {
      case Estado.PENDIENTE:
        return {
          texto: "🚀 Aceptar y Cocinar",
          color: "primary",
          siguiente: Estado.PREPARACION,
        };
      case Estado.PREPARACION:
        return {
          texto: "👨‍🍳 Terminar Cocción",
          color: "warning",
          siguiente: Estado.PENDIENTE_ENTREGA,
        };
      case Estado.PENDIENTE_ENTREGA:
        return {
          texto: "🛍️ Marcar como Entregado",
          color: "success",
          siguiente: Estado.ENTREGADO,
        };
      default:
        return { texto: "Ver Detalle", color: "info", siguiente: estado };
    }
  };

  const handleVerReceta = (articulo: IArticuloManufacturado) => {
    if (articulo?.articuloManufacturadoDetalles) {
      setArticuloSeleccionado(articulo);
      setShowModal(true);
    } else {
      // Si no es manufacturado o no tiene receta, no hacemos nada o mostramos aviso
      console.log("Este artículo no posee receta detallada.");
    }
  };

  // 🚀 Función para buscar la promo completa con sus artículos reales
  const handleVerDetallePromocion = async (promocionParcial: IPromocion) => {
    try {
      // Hacemos un fetch rápido al endpoint que SÍ trae los artículos completos
      const response = await fetch(
        `http://localhost:8080/promociones/${promocionParcial.id}`,
      );
      if (response.ok) {
        const promoCompleta = await response.json();
        setArticuloSeleccionado(null); // Limpiamos el artículo para que no interfiera
        setPromoSeleccionada(promoCompleta);
        setShowModal(true);
      } else {
        // Si falla por algo, mostramos al menos lo que teníamos
        setPromoSeleccionada(promocionParcial);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error al traer detalle de promo:", error);
    }
  };

  return (
    <div className="p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Monitor de Pedidos</h3>
          <small className="text-muted">
            Vista: <strong>{rolUsuario}</strong>
          </small>
        </div>
        <CButton
          color="primary"
          variant="outline"
          size="sm"
          onClick={fetchPedidos}
        >
          🔄 Actualizar Lista
        </CButton>
      </div>

      {pedidos.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center mt-5 p-5 bg-white shadow-sm rounded-4 border-0 text-center">
          <div style={{ fontSize: "4rem" }}>
            {rolUsuario === "COCINERO" ? "🍳" : "😴"}
          </div>
          <h4 className="text-muted mt-3 fw-bold">
            {rolUsuario === "COCINERO" ? "¡Cocina despejada!" : "¡Todo al día!"}
          </h4>
          <p className="text-muted">
            No hay pedidos para mostrar en este momento.
          </p>
        </div>
      ) : (
        <CRow>
          {pedidos.map((pedido) => {
            const config = getBotonConfig(pedido.estado);

            return (
              <CCol xs={12} md={6} lg={4} key={pedido.id} className="mb-4">
                <CCard
                  className="shadow-sm border-0"
                  style={{ borderRadius: "15px", overflow: "hidden" }}
                >
                  <CCardHeader className="bg-white border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-muted small">
                      ORDEN #{pedido.id}
                    </span>
                    <div className="d-flex align-items-center gap-2">
                      <CBadge
                        color={
                          pedido.estado === Estado.PENDIENTE
                            ? "danger"
                            : pedido.estado === Estado.PREPARACION
                              ? "warning"
                              : "success"
                        }
                        shape="rounded-pill"
                        className="px-3 py-1"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {pedido.estado.replace("_", " ")}
                      </CBadge>
                      {rolUsuario !== "COCINERO" && (
                        <CButton
                          color="link"
                          className="p-0 text-danger text-decoration-none fw-bold"
                          onClick={() =>
                            handleCambioEstado(pedido.id!, Estado.CANCELADO)
                          }
                        >
                          &times;
                        </CButton>
                      )}
                    </div>
                  </CCardHeader>

                  <CCardBody className="d-flex flex-column p-3">
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
                          {pedido.cliente?.nombre || "Consumidor Final"}{" "}
                          {pedido.cliente?.apellido || ""}
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
                            pedido.tipoEnvio === "DELIVERY"
                              ? "danger"
                              : "success"
                          }
                          shape="rounded-pill"
                          className="px-2"
                          style={{ fontSize: "0.6rem" }}
                        >
                          {pedido.tipoEnvio}
                        </CBadge>
                      </div>
                    </div>

                    {/* LISTADO DE PRODUCTOS (DetallePedido) */}
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
                      {pedido.detallePedidos?.map((detalle, idx) => {
                        const art = detalle.articulo;
                        const promo = detalle.promocion;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const esManufacturado =
                          art &&
                          ("preparacion" in art ||
                            (art as any).articuloManufacturadoDetalles);
                        const esPromocion = !!promo;

                        return (
                          <div key={idx} className="mb-2 border-bottom pb-1">
                            <div
                              className="d-flex align-items-center justify-content-between"
                              style={{
                                cursor:
                                  esManufacturado || esPromocion
                                    ? "pointer"
                                    : "default",
                              }}
                              onClick={() => {
                                if (esManufacturado) {
                                  setPromoSeleccionada(null);
                                  handleVerReceta(
                                    art as IArticuloManufacturado,
                                  );
                                } else if (esPromocion) {
                                  // 🛑 EN VEZ DE ABRIR EL MODAL ROTO DIRECTO, LLAMAMOS A NUESTRA FUNCIÓN ASÍNCRONA:
                                  handleVerDetallePromocion(promo);
                                }
                              }}
                            >
                              <div className="d-flex align-items-start">
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
                                  {art?.denominacion || promo?.denominacion}
                                </span>
                              </div>
                              {(esManufacturado || esPromocion) && (
                                <CBadge
                                  color="info"
                                  className="ms-2"
                                  style={{ fontSize: "0.6rem" }}
                                >
                                  {esPromocion ? "VER PROMO" : "RECETA"}
                                </CBadge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {rolUsuario !== "COCINERO" && (
                      <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                        <span className="fw-bold text-muted small">
                          TOTAL A COBRAR
                        </span>
                        <span className="fw-bolder text-danger h4 mb-0">
                          ${pedido.total}
                        </span>
                      </div>
                    )}

                    <div className="d-grid gap-2">
                      <CButton
                        color={config.color}
                        className="text-white fw-bold py-2 shadow-sm border-0"
                        style={{ borderRadius: "8px" }}
                        onClick={() =>
                          handleCambioEstado(pedido.id!, config.siguiente)
                        }
                      >
                        {config.texto}
                      </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            );
          })}
        </CRow>
      )}

      {/* MODAL HÍBRIDO (RECETA O PROMO) */}
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle className="fw-bold">
            {articuloSeleccionado
              ? `Receta: ${articuloSeleccionado.denominacion}`
              : `Promo: ${promoSeleccionada?.denominacion}`}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* VISTA ARTICULO */}
          {articuloSeleccionado && (
            <>
              <div className="mb-3">
                <CBadge color="dark">
                  ⏱️ {articuloSeleccionado.tiempoEstimadoMinutos} min
                </CBadge>
              </div>
              <h6
                className="fw-bold text-muted border-bottom pb-2 text-uppercase"
                style={{ fontSize: "0.8rem" }}
              >
                Insumos
              </h6>
              <ul className="list-group list-group-flush mb-3">
                {articuloSeleccionado.articuloManufacturadoDetalles?.map(
                  (det, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between px-0 py-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <span>{det.articulo?.denominacion}</span>
                      <span className="fw-bold">
                        {det.cantidad}{" "}
                        {det.articulo?.unidadMedida?.denominacion}
                      </span>
                    </li>
                  ),
                )}
              </ul>
              <h6
                className="fw-bold text-muted border-bottom pb-2 text-uppercase"
                style={{ fontSize: "0.8rem" }}
              >
                Preparación
              </h6>
              <div
                className="p-3 bg-light rounded"
                style={{
                  whiteSpace: "pre-line",
                  fontSize: "0.85rem",
                  borderLeft: "4px solid #3c4b64",
                }}
              >
                {articuloSeleccionado.preparacion || "Sin instrucciones."}
              </div>
            </>
          )}

          {/* VISTA PROMOCIÓN */}
          {promoSeleccionada && (
            <>
              <h6
                className="fw-bold text-muted border-bottom pb-2 text-uppercase"
                style={{ fontSize: "0.8rem" }}
              >
                Productos incluidos
              </h6>
              <ul className="list-group list-group-flush">
                {promoSeleccionada.promocionDetalles?.map(
                  (det: any, i: number) => {
                    // 🔍 DIAGNÓSTICO OPCIONAL: Descomentá esta línea si querés ver en la consola (F12) cómo viene exacto del back:
                    console.log("Detalle de la promo:", det);

                    // 🛡️ Búsqueda robusta en todas las formas que el DTO de Spring Boot suele devolver el nombre:
                    const nombreProducto =
                      det.articulo?.denominacion ||
                      det.articuloManufacturado?.denominacion ||
                      det.articuloInsumo?.denominacion ||
                      det.denominacion ||
                      det.articuloDenominacion ||
                      det.nombre ||
                      "Artículo incluido";

                    return (
                      <li
                        key={i}
                        className="list-group-item d-flex justify-content-between align-items-center px-0"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <span className="fw-medium text-dark">
                          {nombreProducto}
                        </span>
                        <CBadge color="secondary" shape="rounded-pill">
                          Cant: {det.cantidad}
                        </CBadge>
                      </li>
                    );
                  },
                )}
              </ul>
            </>
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};

export default MonitorPedidos;
