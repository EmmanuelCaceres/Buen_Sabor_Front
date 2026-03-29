import IPedido from "../../Entities/IPedido";
import { GenericFetch } from "../GenericFetch";

export default class PedidoService extends GenericFetch<IPedido>{

    async PostPedidoData<T>(data:T) {
        console.log(data);
        try {
          const response = await fetch(`${this.baseUrl}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: 'cors',
            body: JSON.stringify(data),
          });
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json() as T; // Retorna los datos en formato JSON
        } catch (error) {
          return Promise.reject(error); // Rechaza la promesa con el error
        }
      }

      static async cambiarEstado(id: number, estadoDto: { estado: string }) {
    const url = `http://localhost:8080/pedidos/cambiarEstado/${id}`; // Ajustá la URL si es necesario
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

}