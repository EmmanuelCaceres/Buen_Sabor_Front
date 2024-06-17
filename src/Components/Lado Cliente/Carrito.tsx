import { useState } from "react"
import { useCarrito } from "./context/useCarrito"
// import { PostPedidoData } from "../Functions/FunctionsApi"
// import iconDeleteCart from "../assets/img/iconDeleteCart.svg"
// import iconPurchaseCart from "../assets/img/iconPurchaseCart.svg"
import IPedido from "../../Entities/IPedido"
import IDetallePedido from "../../Entities/IDetallePedido"
import PedidoService from "../../Functions/Services/PedidoService"

function ItemCarrito(props: { item: IDetallePedido }) {
    return (
        <div className="itemCarrito">
            <img width={50} height={50}
                src={'http://localhost:8080/imagenArticulos/uploads/' + props.item.articulo.imagenes[0].url}
                alt={props.item.articulo.denominacion}
            />
            <p><strong>{props.item.articulo.denominacion}</strong> - ${props.item.articulo.precioVenta}</p>
            <b>{props.item.cantidad} {props.item.cantidad == 1 ? 'unidad' : 'unidades'} </b>
        </div>
    )
}

export default function Carrito() {
    const { cart, totalPedido, fechaActual } = useCarrito()
    const [status, setStatus] = useState<number>(0);

    const handleCheckout = async () => {
        if (totalPedido == 0) {
            alert("Debe agregar un intrumento al carrito antes de realizar la compra")
        } else {
            let pedidoAux: IPedido = {
                id: 0,
                eliminado: false,
                horaEstimadaFinalizacion: "14:30:00",
                total: totalPedido,
                totalCosto: totalPedido + 300,
                estado: "PENDIENTE",
                tipoEnvio: "DELIVERY",
                formaPago: "EFECTIVO",
                fechaPedido: fechaActual,
                detallePedidos: cart
            }
            console.log(pedidoAux);

            const result = new PedidoService("http://localhost:8080/pedido");
            result.PostPedidoData(pedidoAux)
                .then(data => {
                    alert(`Su pedido con id ${data.id} ha sido guardado exitosamente`)
                    window.location.reload()
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    return (
        <>
            {totalPedido>0 &&(
                <div style={{ margin: "0 1rem" }}>
                    <h3>Carrito de compras</h3>
                    {cart.map((itemCart: IDetallePedido) => (
                        <ItemCarrito key={itemCart.articulo.id} item={itemCart} />
                    ))}
                    <p>Total del pedido: ${totalPedido}</p>

                    <div style={{ display: "flex", gap: ".5rem" }}>
                        <button className="buttonPurchaseCart" onClick={handleCheckout}>
                            {/* <img src={iconPurchaseCart} alt="iconDeleteCart" /> */}
                            Hacer pedido
                        </button>

                        <button className="buttonDeleteCart">
                            {/* <img src={iconDeleteCart} alt="iconDeleteCart" /> */}
                            Eliminar carrito
                        </button>
                    </div>
                </div>
            )
            }
        </>
    )
}