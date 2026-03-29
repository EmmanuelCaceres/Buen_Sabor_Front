import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import  PedidoService  from '../../Functions/Services/PedidoService'; // Ajustá la ruta a tu servicio
import { Estado } from '../../Entities/Enums'; // Tu Enum de Estados

export const PagoConfirmado = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Obtenemos los datos que manda Mercado Pago por la URL
    const status = searchParams.get('status');
    const pedidoId = searchParams.get('external_reference'); // Asegurate de mandarlo desde el Back

    useEffect(() => {
        const actualizarPedido = async () => {
            if (status === 'approved' && pedidoId) {
                try {
                    // Llamamos a tu endpoint de cambiar estado
                    // Mandamos el estado PREPARACION porque ya está pago
                    await PedidoService.cambiarEstado(Number(pedidoId), { estado: Estado.PREPARACION });
                    console.log("Pedido actualizado a PREPARACION");
                } catch (error) {
                    console.error("Error al actualizar el pedido:", error);
                } finally {
                    setLoading(false);
                    // Después de 3 segundos lo mandamos al menú o a sus pedidos
                    setTimeout(() => navigate('/mis-pedidos'), 3000);
                }
            } else {
                setLoading(false);
            }
        };

        actualizarPedido();
    }, [status, pedidoId, navigate]);

    return (
        <div className="container mt-5 text-center">
            {loading ? (
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Procesando...</span>
                </div>
            ) : status === 'approved' ? (
                <div className="alert alert-success">
                    <h2>¡Pago Confirmado!</h2>
                    <p>Tu pedido ya está en la cocina. Redirigiendo...</p>
                </div>
            ) : (
                <div className="alert alert-danger">
                    <h2>Hubo un problema con el pago</h2>
                    <p>Por favor, intentá nuevamente o contactanos.</p>
                    <button className="btn btn-outline-danger" onClick={() => navigate('/menu')}>Volver al menú</button>
                </div>
            )}
        </div>
    );
};