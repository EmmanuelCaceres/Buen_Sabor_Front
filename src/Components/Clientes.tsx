import { useEffect, useState, useCallback } from "react";
import PedidoService, { IClientePedidoHistorial } from "../Functions/Services/PedidoService";
import ICliente from "../Entities/ICliente"; // <-- Importamos tu interfaz real

export default function Clientes() {
    // Cambiamos el tipo de los estados a tu interfaz real ICliente
    const [clientes, setClientes] = useState<ICliente[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    // Estados para el Modal del Historial del Cliente
    const [clienteSeleccionado, setClienteSeleccionado] = useState<ICliente | null>(null);
    const [historialPedidos, setHistorialPedidos] = useState<IClientePedidoHistorial[]>([]);
    const [loadingHistorial, setLoadingHistorial] = useState<boolean>(false);
    const [verModal, setVerModal] = useState<boolean>(false);

    // Carga inicial de la tabla de clientes
    const cargarClientes = useCallback(async () => {
        try {
            setLoading(true);
            const servicio = new PedidoService();
            const data = await servicio.getClientes(); 
            setClientes(data);
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarClientes();
    }, [cargarClientes]);

    // Abre el modal y carga los pedidos específicos del cliente seleccionado
    const abrirHistorialCliente = async (cliente: ICliente) => {
        setClienteSeleccionado(cliente);
        setVerModal(true);
        setLoadingHistorial(true);
        try {
            const servicio = new PedidoService();
            const data = await servicio.getPedidosByClienteId(cliente.id);
            setHistorialPedidos(data);
        } catch (error) {
            console.error("Error cargando historial del cliente:", error);
        } finally {
            setLoadingHistorial(false);
        }
    };

    const getBadgeColor = (estado: string) => {
        switch (estado) {
            case "ENTREGADO": return "bg-success-subtle text-success";
            case "PENDIENTE": return "bg-warning-subtle text-warning";
            case "CANCELADO": return "bg-danger-subtle text-danger";
            default: return "bg-secondary-subtle text-secondary";
        }
    };

    // Calcula el dinero total que el cliente dejó en el local
    const calcularTotalInvertido = () => {
        return historialPedidos
            .filter(p => p.estado !== "CANCELADO")
            .reduce((acc, p) => acc + p.total, 0);
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
                    <h5 className="m-0" style={{ color: '#2c3e50', fontWeight: 600 }}>Gestión de Clientes</h5>
                    <button className="btn btn-sm btn-outline-primary" onClick={cargarClientes}>Actualizar</button>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Nombre Completo</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.length > 0 ? (
                                    clientes.map((c) => (
                                        <tr key={c.id}>
                                            {/* Gracias a que hereda de IPersona, estas propiedades mapean directo */}
                                            <td className="ps-4 fw-bold text-muted">#{c.id}</td>
                                            <td className="fw-semibold" style={{ color: '#2c3e50' }}>{c.apellido}, {c.nombre}</td>
                                            <td>{c.usuario.email || "Sin email"}</td>
                                            <td>{c.telefono || "Sin teléfono"}</td>
                                            <td className="text-center">
                                                <button 
                                                    className="btn btn-sm btn-primary px-3" 
                                                    style={{ borderRadius: '8px', fontSize: '0.85rem' }}
                                                    onClick={() => abrirHistorialCliente(c)}
                                                >
                                                    <i className="bi bi-journal-text me-1"></i> Ver Pedidos
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-muted">
                                            No se encontraron clientes registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL: HISTORIAL DE COMPRAS DEL CLIENTE */}
            {verModal && clienteSeleccionado && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} role="dialog">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '15px', border: 'none' }}>
                            <div className="modal-header">
                                <h5 className="modal-title" style={{ fontWeight: 600 }}>
                                    Historial de {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setVerModal(false)}></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                {loadingHistorial ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                        <p className="text-muted small mt-2 mb-0">Cargando el historial de compras...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-between align-items-center mb-4 bg-primary-subtle p-3 rounded" style={{ border: '1px solid #b4c6ef' }}>
                                            <span className="fw-medium text-primary">Total Histórico Invertido:</span>
                                            <span className="fw-bold fs-4 text-primary">${calcularTotalInvertido()}</span>
                                        </div>

                                        <h6 className="fw-bold mb-3" style={{ color: '#34495e' }}>Pedidos realizados:</h6>
                                        <div className="table-responsive">
                                            <table className="table table-sm align-middle mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Pedido</th>
                                                        <th>Fecha</th>
                                                        <th>Envío</th>
                                                        <th>Monto</th>
                                                        <th className="text-end">Estado</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {historialPedidos.length > 0 ? (
                                                        historialPedidos.map((p) => (
                                                            <tr key={p.id}>
                                                                <td className="fw-bold text-primary">#{p.id}</td>
                                                                <td>{new Date(p.fechaPedido).toLocaleDateString()}</td>
                                                                <td>
                                                                    <span className="small text-muted">{p.tipoEnvio}</span>
                                                                </td>
                                                                <td className="fw-semibold">${p.total}</td>
                                                                <td className="text-end">
                                                                    <span className={`badge ${getBadgeColor(p.estado)}`} style={{ fontSize: '0.75rem' }}>
                                                                        {p.estado}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={5} className="text-center py-3 text-muted small">
                                                                Este cliente todavía no ha realizado ningún pedido.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer" style={{ borderTop: 'none' }}>
                                <button type="button" className="btn btn-light" style={{ borderRadius: '8px' }} onClick={() => setVerModal(false)}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}