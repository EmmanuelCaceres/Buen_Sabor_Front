import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import imagenPorDefecto from "../assets/imagenes/empresa.jpg";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";

// Importa tus interfaces reales aquí.
// Si no las tienes en archivos separados, déjalas aquí arriba:
import IPromocion from "../Entities/IPromocion";
import IArticuloManufacturado from "../Entities/IArticuloManufacturado";
import { IPromocionDetalle } from "../Entities/IPromocionDetalle";

// Definimos la unión de tipos para que el estado acepte ambos
type ProductDetail = IPromocion | IArticuloManufacturado;

export default function DescriptionPromotion() {
  const apiUrl = import.meta.env.VITE_URL_API_BACK;

  // Especificamos que los parámetros son strings
  const { tipo, id } = useParams<{ tipo: string; id: string }>();

  // Usamos el tipo correcto en el State
  const [item, setItem] = useState<ProductDetail | null>(null);
  const dispatch = useDispatch();

  const fetchDetail = async () => {
    try {
      // Decidimos el endpoint según el parámetro de la URL
      const endpoint =
        tipo === "promocion"
          ? `${apiUrl}promociones/${id}`
          : `${apiUrl}articulosManufacturados/${id}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data) {
        setItem(data);
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    }
  };

  const handleAddItem = () => {
    if (item) {
      const esPromo = tipo === "promocion";

      // Usamos Type Guarding para acceder a propiedades específicas
      const precio = esPromo
        ? (item as IPromocion).precioPromocional
        : (item as IArticuloManufacturado).precioVenta;

      dispatch(
        addItem({
          id: item.id,
          tipo: esPromo ? "PROMOCION" : "ARTICULO",
          productData: {
            ...item,
            precioVenta: precio,
          },
        }),
      );
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id, tipo]);

  if (!item) return <div className="text-center p-5">Cargando...</div>;

  const esPromo = tipo === "promocion";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: "32px",
        padding: "20px",
      }}
    >
      <div className="imagePromContainer" style={{ position: "relative" }}>
        {/* Badge de Precio */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            position: "absolute",
            top: "0",
            left: "30px",
            width: "112px",
            height: "100px",
            backgroundColor: "#FF9F00",
            zIndex: "10",
          }}
        >
          <p
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "0",
              paddingTop: "24px",
            }}
          >
            {esPromo ? "Precio Promo" : "Precio"}
          </p>
          <p style={{ color: "white", marginBottom: "0" }}>
            $
            {esPromo
              ? (item as IPromocion).precioPromocional
              : (item as IArticuloManufacturado).precioVenta}
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            top: "55px",
            left: "43px",
            width: "85px",
            height: "85px",
            backgroundColor: "#FF9F00",
            rotate: "45deg",
            borderRadius: "10px",
          }}
        ></div>

        <div
          style={{
            width: "fit-content",
            height: "fit-content",
            border: "1px solid #FF9F00",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <img
            src={
              item.imagenes && item.imagenes.length > 0
                ? item.imagenes[0].url
                : imagenPorDefecto
            }
            alt={item.denominacion}
            width="541"
            height="350"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = imagenPorDefecto;
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          padding: "16px 0",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h2>{item.denominacion}</h2>
        <p
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "10px",
            padding: "12px",
          }}
        >
          {esPromo
            ? (item as IPromocion).descripcionDescuento
            : (item as IArticuloManufacturado).descripcion ||
              "Sin descripción disponible."}
        </p>

        {esPromo ? (
          <>
            <p style={{ fontWeight: "bold" }}>
              Válida del:{" "}
              <span style={{ fontWeight: "normal" }}>
                {(item as IPromocion).fechaDesde.toString()} al{" "}
                {(item as IPromocion).fechaHasta.toString()}
              </span>
            </p>
            <div>
              <p>Incluye:</p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {(item as IPromocion).promocionDetalles?.map(
                  (detalle: IPromocionDetalle) => (
                    <li
                      style={{ color: "#0F2D6B", fontWeight: "bold" }}
                      key={detalle.id}
                    >
                      {detalle.cantidad} x {detalle.articulo.denominacion}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </>
        ) : (
          <div style={{ fontSize: "1.1rem" }}>
            <p>
              <strong>Tiempo estimado:</strong>{" "}
              {(item as IArticuloManufacturado).tiempoEstimadoMinutos} minutos
              ⏱️
            </p>
            <p>
              <strong>Categoría:</strong>
              {(item as IArticuloManufacturado)
                .articuloManufacturadoDetalles?.[0]?.articulo?.categoria
                ?.denominacion || "General"}
            </p>
          </div>
        )}

        <button
          onClick={handleAddItem}
          style={{
            backgroundColor: "#FF9F00",
            borderRadius: "10px",
            maxWidth: "225px",
            border: "none",
            padding: "10px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}
