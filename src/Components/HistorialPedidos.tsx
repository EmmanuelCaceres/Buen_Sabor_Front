import { useEffect, useState, useCallback } from "react";
import PedidoService, { IPedidoHistorial, IPedidoDetalle } from "../Functions/Services/PedidoService";

export default function HistorialPedidos() {
    const [pedidos, setPedidos] = useState<IPedidoHistorial[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    // NUEVOS ESTADOS: Para manejar la ventana modal y la carga del detalle
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<IPedidoHistorial | null>(null);
    const [detalles, setDetalles] = useState<IPedidoDetalle[]>([]);
    const [loadingDetalle, setLoadingDetalle] = useState<boolean>(false);
    const [verDetalle, setVerDetalle] = useState<boolean>(false);
    
    // ID de la sucursal activa
    const sucursalId = Number(localStorage.getItem("sucursalId")) || 1; 

    const cargarHistorial = useCallback(async () => {
        try {
            setLoading(true);
            const servicio = new PedidoService();
            const data = await servicio.getHistorialBySucursal(sucursalId);
            setPedidos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [sucursalId]);

    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    // NUEVA FUNCIÓN: Se ejecuta al hacer clic en una fila de la tabla
    const abrirDetalle = async (pedido: IPedidoHistorial) => {
        setPedidoSeleccionado(pedido);
        setVerDetalle(true);
        setLoadingDetalle(true);
        try {
            const servicio = new PedidoService();
            // Le pega al endpoint genérico por ID pasándole el id del pedido
            const data = await servicio.getDetailsByPedidoId(pedido.id);
            setDetalles(data);
        } catch (error) {
            console.error("Error cargando detalles del pedido:", error);
        } finally {
            setLoadingDetalle(false);
        }
    };

    // Función auxiliar para darle color a los Badges de los estados
    const getBadgeColor = (estado: string) => {
        switch (estado) {
            case "ENTREGADO": return "bg-success-subtle text-success";
            case "PENDIENTE": return "bg-warning-subtle text-warning";
            case "CANCELADO": return "bg-danger-subtle text-danger";
            default: return "bg-secondary-subtle text-secondary";
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4 py-4">
            <div className="card shadow-sm" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center" style={{ borderRadius: '15px 15px 0 0' }}>
                    <h5 className="m-0" style={{ color: '#2c3e50', fontWeight: 600 }}>Historial de Pedidos</h5>
                    <button className="btn btn-sm btn-outline-primary" onClick={cargarHistorial}>
                        Actualizar
                    </button>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Nro Pedido</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Tipo Envío</th>
                                    <th>Total</th>
                                    <th className="pe-4 text-end">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.length > 0 ? (
                                    pedidos.map((p) => (
                                        <tr 
                                            key={p.id} 
                                            onClick={() => abrirDetalle(p)} // <-- CLAVE 1: Evento de clic
                                            style={{ cursor: 'pointer' }}   // <-- CLAVE 2: Puntero de manito
                                            title="Click para ver el detalle"
                                        >
                                            <td className="ps-4 fw-bold" style={{ color: '#4e73df' }}>#{p.id}</td>
                                            <td>{new Date(p.fechaPedido).toLocaleDateString()}</td>
                                            <td>{p.clienteNombre}</td>
                                            <td>
                                                <span className={`badge ${p.tipoEnvio === 'DELIVERY' ? 'bg-info-subtle text-info' : 'bg-primary-subtle text-primary'}`}>
                                                    {p.tipoEnvio}
                                                </span>
                                            </td>
                                            <td className="fw-semibold">${p.total}</td>
                                            <td className="pe-4 text-end">
                                                <span className={`badge ${getBadgeColor(p.estado)} px-2.5 py-1.5`} style={{ borderRadius: '6px' }}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-muted">
                                            No se encontraron pedidos en esta sucursal.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL DE BOOTSTRAP DINÁMICO */}
            {verDetalle && pedidoSeleccionado && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '15px', border: 'none' }}>
                            <div className="modal-header">
                                <h5 className="modal-title" style={{ fontWeight: 600 }}>Detalle del Pedido #{pedidoSeleccionado.id}</h5>
                                <button type="button" className="btn-close" onClick={() => setVerDetalle(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <p className="mb-1"><strong>Cliente:</strong> {pedidoSeleccionado.clienteNombre}</p>
                                    <p className="mb-1"><strong>Tipo de Envío:</strong> {pedidoSeleccionado.tipoEnvio}</p>
                                </div>
                                <hr />
                                
                                <h6 className="fw-bold mb-3" style={{ color: '#34495e' }}>Artículos pedidos:</h6>
                                
                                {loadingDetalle ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                        <p className="text-muted small mt-2 mb-0">Buscando artículos en el backend...</p>
                                    </div>
                                ) : (
                                    <div className="mb-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                        {detalles.length > 0 ? (
                                            detalles.map((det, index) => (
                                                <div key={index} className="d-flex justify-content-between align-items-center mb-2 bg-light p-2 rounded">
                                                    <div>
                                                        <span className="badge bg-secondary me-2">{det.cantidad}x</span>
                                                        <span className="fw-medium">
                                                            {det.articulo?.denominacion || det.promocion?.denominacion || "Artículo"}
                                                        </span>
                                                    </div>
                                                    <span className="fw-semibold text-secondary">${det.subTotal}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted small text-center my-2">No se encontraron artículos cargados en este pedido.</p>
                                        )}
                                    </div>
                                )}

                                <hr />
                                <div className="d-flex justify-content-between align-items-center fw-bold fs-5" style={{ color: '#2c3e50' }}>
                                    <span>Total Facturado:</span>
                                    <span className="text-primary">${pedidoSeleccionado.total}</span>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ borderTop: 'none' }}>
                                <button type="button" className="btn btn-light" style={{ borderRadius: '8px', fontWeight: 500 }} onClick={() => setVerDetalle(false)}>
                                    Cerrar Ventana
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}