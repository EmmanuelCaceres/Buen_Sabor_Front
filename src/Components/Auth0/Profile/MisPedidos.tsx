import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Table,
  Badge,
  Card,
  Button,
  Modal,
  Row,
  Col,
  Pagination,
} from "react-bootstrap"; // Agregamos Pagination
import IPedido from "../../../Entities/IPedido";
import { Estado } from "../../../Entities/Enums";
import { useLocation } from "react-router-dom";

interface Props {
  clienteId?: number;
}

const MisPedidos = ({ clienteId }: Props) => {
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [showDetalle, setShowDetalle] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<IPedido | null>(
    null,
  );
  const [pagoExitoso, setPagoExitoso] = useState(false);

  // --- LÓGICA DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const pedidosPorPagina = 5; // Cambia este número según prefieras

  const { getAccessTokenSilently } = useAuth0();
  const apiUrl = import.meta.env.VITE_URL_API_BACK;

  const formatearEnvio = (tipo: string) => {
    if (tipo === "TAKE_AWAY") return "Retira en Sucursal";
    if (tipo === "DELIVERY") return "Envío a Domicilio";
    return tipo;
  };
  const location = useLocation();

  useEffect(() => {
    fetchPedidos();
  }, [clienteId, getAccessTokenSilently, apiUrl]);

  const fetchPedidos = async () => {
    if (!clienteId) return;
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${apiUrl}pedidos/porCliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data: IPedido[] = await res.json();
        // ORDENAR: De más nuevos (ID o fecha mayor) a más viejos
        const ordenados = [...data].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        setPedidos(ordenados);
      }
    } catch (e) {
      console.error("Error al obtener pedidos:", e);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const pedidoId = queryParams.get("pedidoId");

    if (status === "approved" && pedidoId) {
      const actualizarEstado = async () => {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(
            `${apiUrl}pedidos/cambiarEstado/${pedidoId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ estado: "PREPARACION" }),
            },
          );

          if (response.ok) {
            setPagoExitoso(true); // <--- ACTIVAMOS EL CARTEL
            // Limpia la URL sin recargar la página
            window.history.replaceState({}, "", "/mis-pedidos");

            // En lugar de reload(), volvemos a pedir los pedidos para que aparezca el nuevo estado
            fetchPedidos();
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      actualizarEstado();
    }
  }, [location, getAccessTokenSilently, apiUrl]);

  // Cálculos para paginación
  const indexOfLastPedido = currentPage * pedidosPorPagina;
  const indexOfFirstPedido = indexOfLastPedido - pedidosPorPagina;
  const pedidosActuales = pedidos.slice(indexOfFirstPedido, indexOfLastPedido);
  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      {/* CARTEL DE ÉXITO DE MERCADO PAGO */}
      {pagoExitoso && (
        <div className="alert alert-success shadow-sm border-0 mb-4 animate__animated animate__fadeIn">
          <div className="d-flex align-items-center">
            <i className="fas fa-check-circle fa-2x me-3"></i>
            <div>
              <h5 className="mb-0">¡Pago acreditado!</h5>
              <span>
                Tu pedido ya entró al sistema.
                <strong>
                  {" "}
                  Una vez se confirme en cocina, empezaremos a prepararlo.
                </strong>
              </span>
            </div>
            <Button
              variant="close"
              className="ms-auto"
              onClick={() => setPagoExitoso(false)}
            />
          </div>
        </div>
      )}

      <Card className="shadow-sm border-0 mt-4">
        <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-history me-2 text-primary"></i>
            Historial de Pedidos
          </h5>
          <small className="text-muted">Total: {pedidos.length} pedidos</small>
        </Card.Header>
        <Card.Body>
          {pedidosActuales.length > 0 ? (
            <>
              <Table hover responsive className="align-middle border">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">ID</th>
                    <th>Fecha</th>
                    <th>Envío</th>
                    <th>Total</th>
                    <th className="text-center">Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosActuales.map((p) => (
                    <tr key={p.id}>
                      <td className="ps-3 fw-medium">#{p.id}</td>
                      <td>{new Date(p.fechaPedido).toLocaleDateString()}</td>
                      <td>{formatearEnvio(p.tipoEnvio)}</td>
                      <td className="fw-bold text-dark">${p.total}</td>
                      <td className="text-center">
                        <Badge
                          bg={
                            p.estado === Estado.PREPARACION
                              ? "info"
                              : p.estado === Estado.ENTREGADO
                                ? "success"
                                : "warning"
                          }
                          className="px-3 py-2"
                        >
                          {p.estado}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setPedidoSeleccionado(p);
                            setShowDetalle(true);
                          }}
                        >
                          <i className="fas fa-eye"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* COMPONENTE DE PAGINACIÓN */}
              {totalPaginas > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPaginas)].map((_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPaginas}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPaginas)}
                      disabled={currentPage === totalPaginas}
                    />
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-box-open fa-3x text-light mb-3"></i>
              <p className="text-muted fs-5">
                No has realizado pedidos todavía.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDetalle} onHide={() => setShowDetalle(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Detalle del Pedido #{pedidoSeleccionado?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pedidoSeleccionado && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <p className="mb-1 text-muted small uppercase fw-bold">
                    Información de Entrega
                  </p>
                  <hr className="mt-0 mb-2" />

                  <p className="mb-1">
                    <strong>Tipo:</strong>{" "}
                    {formatearEnvio(pedidoSeleccionado.tipoEnvio)}
                  </p>

                  {pedidoSeleccionado.tipoEnvio === "DELIVERY" ? (
                    <div className="mt-2 p-2 bg-light rounded border">
                      <p className="mb-0">
                        <i className="fas fa-map-marker-alt text-danger me-2"></i>
                        <strong>
                          {pedidoSeleccionado.domicilio?.calle}{" "}
                          {pedidoSeleccionado.domicilio?.numero}
                        </strong>
                      </p>
                      <p className="text-muted small mb-0 ms-4">
                        {pedidoSeleccionado.domicilio?.localidad?.nombre},{" "}
                        {
                          pedidoSeleccionado.domicilio?.localidad?.provincia
                            ?.nombre
                        }
                      </p>
                      <p className="text-muted small mb-0 ms-4">
                        CP: {pedidoSeleccionado.domicilio?.cp}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 p-2 bg-light rounded border text-success">
                      <p className="mb-0">
                        <i className="fas fa-store me-2"></i>
                        {/* Mostramos el nombre de la sucursal que viene del backend o un fallback */}
                        <strong>
                          Local:{" "}
                          {pedidoSeleccionado.sucursal?.nombre ||
                            "Sucursal Mendoza Principal"}
                        </strong>
                      </p>
                      <p className="text-muted small mb-0 ms-4">
                        {pedidoSeleccionado.sucursal?.domicilio?.calle}{" "}
                        {pedidoSeleccionado.sucursal?.domicilio?.numero}
                        {" - "}
                        <br />
                        <span className="text-secondary">
                          {
                            pedidoSeleccionado.sucursal.domicilio?.localidad
                              ?.nombre
                          }
                          ,{" "}
                          {
                            pedidoSeleccionado.sucursal.domicilio?.localidad
                              ?.provincia?.nombre
                          }
                        </span>
                      </p>
                    </div>
                  )}
                </Col>

                <Col md={6} className="text-md-end">
                  <p className="mb-1 text-muted small uppercase fw-bold">
                    Estado del Pago
                  </p>
                  <hr className="mt-0 mb-2" />
                  <p className="mb-1">
                    <strong>Estado:</strong>{" "}
                    <Badge
                      bg={
                        pedidoSeleccionado.estado === "ENTREGADO"
                          ? "success"
                          : "warning"
                      }
                      className="px-3"
                    >
                      {pedidoSeleccionado.estado}
                    </Badge>
                  </p>
                  <p className="mb-0">
                    <strong>Método:</strong>{" "}
                    {pedidoSeleccionado.formaPago === "EFECTIVO"
                      ? "Efectivo"
                      : "Mercado Pago"}
                  </p>
                  <p className="mt-2 fw-bold text-primary fs-5">
                    Total: ${pedidoSeleccionado.total}
                  </p>
                </Col>
              </Row>

              <Table hover responsive size="sm">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidoSeleccionado.detallePedidos?.map((det, idx) => (
                    <tr key={idx}>
                      <td>{det.articulo?.denominacion || "Producto"}</td>
                      <td className="text-center">{det.cantidad}</td>
                      <td className="text-end">${det.subTotal}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="text-end fw-bold">
                      TOTAL:
                    </td>
                    <td className="text-end fw-bold text-primary">
                      ${pedidoSeleccionado.total}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetalle(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MisPedidos;
