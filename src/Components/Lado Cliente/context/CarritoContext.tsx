import { createContext, ReactNode, useState, useEffect } from "react";
import IPedido from "../../../Entities/IPedido";
import IDetallePedido from "../../../Entities/IDetallePedido";
import IArticulo from "../../../Entities/IArticulo";
import IArticuloManufacturado from "../../../Entities/IArticuloManufacturado";
import IArticuloInsumo from "../../../Entities/IArticuloInsumo";


interface CartContextType {
    cart: IDetallePedido[];
    addCarrito: (product: IArticuloManufacturado | IArticuloInsumo) => void;
    // removeCarrito: (product: Instrumento) => void;
    removeItemCarrito: (product: IArticuloManufacturado | IArticuloInsumo) => void;
    // limpiarCarrito: () => void;
    totalPedido: number;
    fechaActual: Date;
}


export const CartContext = createContext<CartContextType>({
    cart: [],
    addCarrito: () => { },
    // removeCarrito: () => {},
    removeItemCarrito: () => { },
    // limpiarCarrito: () => {},
    totalPedido: 0,
    fechaActual: new Date()
});

export function CarritoContextProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<IDetallePedido[]>([]);
    const [totalPedido, setTotalPedido] = useState<number>(0);
    const [fechaActual, setFechaActual] = useState<Date>(new Date())

    const addCarrito = (product: IArticuloManufacturado | IArticuloInsumo) => {
        let existe: boolean = false
        console.log("Entre")
        cart.map((cartItem: IDetallePedido) => {
            if (cartItem.articulo.id === product.id) {
                existe = true
                return existe
            }
        });
        console.log(product)
        if (existe) {
            const cartClonado = JSON.parse(JSON.stringify(cart));
            cartClonado.map((detalle: IDetallePedido) => {
                if (detalle.articulo.id === product.id) {
                    detalle.cantidad += 1
                    detalle.subTotal += product.precioVenta
                }
            });
            setCart(cartClonado)
        }
        else {
            console.log("NO EXISTE");
            const nuevoDetalle: IDetallePedido = {
                id: 0,
                articulo: product,
                eliminado: false,
                cantidad: 1,
                subTotal: product.precioVenta,
            };
            setCart(prevCart => [...prevCart, nuevoDetalle])
            console.log(cart)
        }

    };

    // const removeCarrito = async (product: Plato) => {
    //     await setCart(prevCart => prevCart.filter(item => item.id !== product.id))
    // };

    const removeItemCarrito = (product: IArticulo) => {
        let existe: boolean = false
        cart.map((cartItem: IDetallePedido) => {
            if (cartItem.articulo.id === product.id) {
                existe = true
            }
        });

        if (existe) {
            console.log("EXISTE");
            const cartClonado = JSON.parse(JSON.stringify(cart));
            cartClonado.map((detalle: IDetallePedido, index: number) => {
                if (detalle.cantidad > 1) {
                    if (detalle.articulo.id === product.id) {
                        detalle.cantidad -= 1
                        detalle.subTotal -= product.precioVenta
                    }
                } else {
                    if (detalle.articulo.id === product.id) {
                        cartClonado.splice(index, 1);
                    }
                }
            });
            setCart(cartClonado)
        }
    };

    // const limpiarCarrito = () => {
    //     setCart([])
    // }

    const calcularTotalCarrito = async () => {
        let total: number = 0;
        cart.forEach((element: IDetallePedido) => {
            total += Number(element.articulo.precioVenta) * element.cantidad;
        });
        await setTotalPedido(total);
    }
    useEffect(() => {
        calcularTotalCarrito();
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, addCarrito, removeItemCarrito, totalPedido, fechaActual }}>
            {children}
        </CartContext.Provider>
    );

}