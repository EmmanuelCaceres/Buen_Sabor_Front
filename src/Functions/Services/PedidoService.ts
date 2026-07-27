import ICliente from "../../Entities/ICliente";
import IPedido from "../../Entities/IPedido";
import { GenericFetch } from "../GenericFetch";

export interface IClientePedidoHistorial {
  id: number;
  fechaPedido: string;
  total: number;
  estado: string;
  tipoEnvio: string;
}

export interface IPedidoHistorial {
  id: number;
  fechaPedido: string;
  clienteNombre: string;
  total: number;
  estado: string;
  tipoEnvio: string;
}

// Interfaz para mapear la estructura de PedidoDetalleDto / PedidoGetDto del Backend
export interface IPedidoDetalle {
  cantidad: number;
  subTotal: number;
  articulo?: {
    id: number;
    denominacion: string;
  };
  promocion?: {
    id: number;
    denominacion: string;
  };
}

export default class PedidoService extends GenericFetch<IPedido> {
  constructor() {
    const url = `${import.meta.env.VITE_URL_API_BACK}pedidos`;
    super(url);
  }

  async PostPedidoData<T>(data: T) {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json() as T;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async cambiarEstado(id: number, estadoDto: { estado: string }) {
    const url = `http://localhost:8080/pedidos/cambiarEstado/${id}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(estadoDto),
      });

      if (!response.ok) {
        throw new Error(`Error al cambiar estado: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error en PedidoService.cambiarEstado:", error);
      throw error;
    }
  }

  async getHistorialBySucursal(
    sucursalId: number,
  ): Promise<IPedidoHistorial[]> {
    const response = await fetch(
      `${this.baseUrl}/historial/sucursal/${sucursalId}`,
    );
    if (!response.ok) throw new Error("Error al traer el historial de pedidos");
    return await response.json();
  }

  // NUEVO MÉTODO: Conecta con el GET genérico por ID del BaseController
  async getDetailsByPedidoId(pedidoId: number): Promise<IPedidoDetalle[]> {
    const response = await fetch(`${this.baseUrl}/${pedidoId}`);
    if (!response.ok) throw new Error("Error al traer los detalles del pedido");

    const pedidoCompleto = await response.json();

    // IMPORTANTE: Ajustá 'detallePedidos' al nombre exacto con el que tu PedidoGetDto envíe la lista al Front
    return (pedidoCompleto.detallePedidos ||
      pedidoCompleto.detalles ||
      []) as IPedidoDetalle[];
  }

  // AGREGAMOS ESTE MÉTODO (Que se había borrado):
  async getPedidosByClienteId(clienteId: number): Promise<IClientePedidoHistorial[]> {
    const response = await fetch(`${this.baseUrl}/porCliente/${clienteId}`);
    if (!response.ok) throw new Error("Error al traer el historial del cliente");
    return await response.json() as IClientePedidoHistorial[];
  }

  async getClientes(): Promise<ICliente[]> {
    // Usamos la variable de entorno para mantener consistencia con tus rutas
    const response = await fetch(`${import.meta.env.VITE_URL_API_BACK}clientes`);
    if (!response.ok) throw new Error("Error al traer la lista de clientes");
    return await response.json() as ICliente[];
  }
}