import { LabelPublic } from "../../Components";
import { Link } from "react-router-dom";
import "./Home.css";
import { useEffect, useState } from "react";
import ICategoria from "../../Entities/ICategoria";
import imagenPorDefecto from "../../assets/imagenes/empresa.jpg";
import IPromocionGet from "../../Entities/IPromocionGet";
import IArticuloManufacturado from "../../Entities/IArticuloManufacturado";
import { ModalSucursal } from "../Modal/ModalSucursal";

export const Home = () => {
  const apiUrl = import.meta.env.VITE_URL_API_BACK;
  const [categories, setCategories] = useState<ICategoria[]>([]);
  const [promociones, setPromociones] = useState<IPromocionGet[]>([]);
  const [productosEstrella, setProductosEstrella] = useState<IArticuloManufacturado[]>([]);
  const [idSucursal, setIdSucursal] = useState<number | null>(() => {
    const saved = localStorage.getItem("selectedSucursalId");
    return saved ? parseInt(saved) : null;
  });

  const handleSelectSucursal = (id: number) => {
    localStorage.setItem("selectedSucursalId", id.toString());
    setIdSucursal(id);
  };

  // 1. Definimos las funciones de carga una sola vez
  const fetchData = async () => {
    if (!idSucursal) return;

    try {
      // Categorías
      const resCat = await fetch(`${apiUrl}categorias/getAll`);
      const dataCat = await resCat.json();
      setCategories(dataCat);

      // Promociones filtradas
      const resPromo = await fetch(`${apiUrl}promociones/porSucursal/${idSucursal}`);
      const dataPromo = await resPromo.json();
      setPromociones(dataPromo.content || dataPromo);

      // Artículos filtrados
      const resArt = await fetch(`${apiUrl}articulosManufacturados/porSucursal/${idSucursal}`);
      const dataArt = await resArt.json();
      setProductosEstrella(dataArt.content || dataArt);

    } catch (error) {
      console.error("Error al cargar los datos de la sucursal:", error);
    }
  };

  // 2. Un solo useEffect que dispara la carga cuando cambia la sucursal
  useEffect(() => {
    fetchData();
  }, [idSucursal, apiUrl]);

  if (!idSucursal) {
    return <ModalSucursal onSelect={handleSelectSucursal} />;
  }

  return (
    <>
    <button onClick={() => { localStorage.removeItem("selectedSucursalId"); setIdSucursal(null); }}>
        Cambiar Sucursal
      </button>
      <section>
        <LabelPublic text="Promociones espectaculares" />
        <div
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            padding: "24px 0",
          }}
        >
          {promociones.map((promocion: IPromocionGet) => (
            <Link
              key={promocion.id}
              to={`/description/promocion/${promocion.id}`}
              className="card-producto"
            >
              <img
                src={
                  promocion.imagenes && promocion.imagenes.length > 0
                    ? promocion.imagenes[0].url
                    : imagenPorDefecto
                }
                alt={promocion.denominacion}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = imagenPorDefecto;
                }}
              />
              <p>{promocion.denominacion}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <LabelPublic text="Basados en categorías" />
        <div
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            padding: "24px 0",
          }}
        >
          {categories.map((category: ICategoria) => (
            <Link
              key={category.id}
              to={`/tienda?categoria=${category.id}`}
              className="card-producto"
            >
              <img
                src={`/${category.denominacion.toLowerCase()}-home.jpg`}
                alt={category.denominacion}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = imagenPorDefecto;
                }}
              />
              <p>{category.denominacion}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SECCIÓN PRODUCTOS ESTRELLA EN GRID */}
      <section style={{ padding: "20px" }}>
        <LabelPublic text="Descubre nuestros productos estrellas" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            padding: "24px 0",
          }}
        >
          {productosEstrella.map((producto: IArticuloManufacturado) => (
            <Link
              key={producto.id}
              to={`/description/articulo/${producto.id}`}
              className="card-producto"
              style={{ width: "100%", margin: "0" }} // Quitamos anchos fijos para que el grid mande
            >
              <img
                src={
                  producto.imagenes && producto.imagenes.length > 0
                    ? producto.imagenes[0].url
                    : imagenPorDefecto
                }
                alt={producto.denominacion}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = imagenPorDefecto;
                }}
              />
              <div style={{ padding: "10px" }}>
                <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {producto.denominacion}
                </p>
                <p
                  style={{
                    color: "#e67e22",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  ${producto.precioVenta}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                    fontSize: "0.85rem",
                    color: "#666",
                  }}
                >
                  <span>⏱️ {producto.tiempoEstimadoMinutos} min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};
