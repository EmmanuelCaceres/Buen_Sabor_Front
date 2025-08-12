import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PromocionService from "../Functions/Services/PromocionService";
import imagenPorDefecto from "../assets/imagenes/empresa.jpg"
import IPromocionDetalleGet from "../Entities/IPromocionDetalleGet";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";


export default function DescriptionPromotion() {

    const apiUrl = import.meta.env.VITE_URL_API_BACK
    const { id } = useParams();
    const [promocion, setPromocion] = useState<any>();
    const dispatch = useDispatch();

    const getPromocion = async (baseUrl: string, id: number) => {
        try {
            const result = new PromocionService(baseUrl);
            await result.get(id)
                .then(data => {
                    if (data !== null) {
                        setPromocion(data);
                        console.log(data)
                        // console.log("DATA: " + JSON.stringify(data, null, 2));
                    } else {
                        console.log("La promocion no se encontró.");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            // const response = await fetch(`${apiUrl}promociones/${id}`);
        } catch (error) {
            console.error("Error fetching promociones:", error);
        }
    };

    const handleAddItem = () => {
        if (promocion) {
            dispatch(addItem({
                id: promocion.id,
                tipo: 'PROMOCION',
                productData: { ...promocion, precioVenta: promocion.precioPromocional } // Aseguramos que el precio se pase correctamente
            }));
        }
    };

    useEffect(() => {
        getPromocion(`${apiUrl}promociones`, Number(id));
    }, [apiUrl])

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "32px" }}>
            <div className="imagePromContainer" style={{position:"relative"}}>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"8px",position:"absolute", top:"0", left:"30px",width:"112px", height:"100px", backgroundColor:"#FF9F00",zIndex:"10"}}>
                    <p style={{color:"white",fontWeight:"bold",textAlign:"center",marginBottom:"0",paddingTop:"24px"}}>Precio promocional</p>
                    <p style={{color:"white",marginBottom:"0"}}>${promocion && promocion.precioPromocional}</p>
                </div>
                <div style={{position:"absolute", top:"55px", left:"43px",width:"85px", height:"85px", backgroundColor:"#FF9F00",rotate:"45deg",borderRadius:"10px"}}>

                </div>
                <div style={{width:"fit-content",height:"fit-content",border:"1px solid #FF9F00",borderRadius:"10px",overflow:"hidden"}}>
                    <img src={``}
                        alt=""
                        width="541"
                        height="350"
                        onError={(e) => {
                            e.currentTarget.onerror = null; // Evita bucles infinitos si la imagen por defecto también falla
                            e.currentTarget.src = imagenPorDefecto;
                        }} />
                </div>
            </div>
            <div style={{ display: "flex", padding: "16px 0", flexDirection: "column", gap: "16px" }}>
                <h2 >{promocion?.denominacion}</h2>
                <p style={{border:"1px solid #e5e5e5", borderRadius:"10px", padding:"12px"}}>{promocion?.descripcionDescuento}</p>
                <p style={{ fontWeight: "bold" }}>Válida del: <span style={{ fontWeight: "normal" }}>{promocion?.fechaDesde} al {promocion?.fechaHasta}</span></p>
                <p style={{ fontWeight: "bold" }}>Horario: <span style={{ fontWeight: "normal" }}>{promocion?.horaDesde} a {promocion?.horaHasta}</span></p>
                <div>
                    <p>Incluye:</p>
                    <ul style={{textDecoration:"none", listStyle:"none"}}>
                        {
                            promocion && promocion.promocionDetalles.map((detalle : IPromocionDetalleGet) => (
                                <li style={{color:"#0F2D6B", fontWeight:"bold"}} key={detalle.id}>{detalle.cantidad} x {detalle.articulo.denominacion}</li>
                            ))
                        }
                    </ul>
                </div>
                <button onClick={handleAddItem} style={{backgroundColor:"#FF9F00",borderRadius:"10px", maxWidth:"225px", border: "none", padding: "10px", color: "white", fontWeight: "bold" }}>
                    Añadir al carrito
                </button>
            </div>
        </div>
    );
}