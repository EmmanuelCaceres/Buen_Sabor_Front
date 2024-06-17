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

}