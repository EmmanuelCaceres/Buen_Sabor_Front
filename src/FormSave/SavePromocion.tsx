import { useEffect, useState } from "react";
import IPromocion from "../Entities/IPromocion";
import { Link, useParams } from "react-router-dom";
import ArticuloManufacturadoService from "../Functions/Services/ArticuloManufacturadoService";
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import "./SavePromocion.css";
import { CustomSelect } from "../Components/CustomSelect/CustomSelect";
import IArticuloManufacturado from "../Entities/IArticuloManufacturado";
import { ButtonPrimary, Modal } from "../Components";
import { useModalContext } from "../Components/Modal/context/ModalContext";
import IArticuloManufacturadoPromocion from "../Entities/IArticuloManufacturadoPromocion";
import PromocionService from "../Functions/Services/PromocionService";
import { TipoPromocion } from "../Entities/TipoPromocion";
import { IPromocionDetalle } from "../Entities/IPromocionDetalle";
import { useDiccionarioEnum } from "../Hooks/useDiccionario";
import ImagenPromocionService from "../Functions/Services/ImagenPromocionService";
import { useSucursal } from "../context/SucursalContext";
import ArticuloInsumoService from "../Functions/Services/ArticuloInsumoService";
import IArticuloInsumo from "../Entities/IArticuloInsumo";
//import ImagenPromocionService from '../Functions/Services/ImagenPromocionService';

export default function SavePromocion() {
  const { sucursalId } = useSucursal();
  const apiUrl = import.meta.env.VITE_URL_API_BACK;
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [promocion, setPromocion] = useState<IPromocion>({
    id: 0,
    baja: false,
    denominacion: "",
    descripcionDescuento: "",
    precioPromocional: 0,
    fechaDesde: new Date(),
    fechaHasta: new Date(),
    horaDesde: "",
    horaHasta: "",
    tipoPromocion: TipoPromocion.Descuento,
    imagenes: [],
    promocionDetalles: [],
    idsSucursal: 0,
  });
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };
  const [articulosManufacturados, setArticulosManufacturados] = useState<
    IArticuloManufacturado[]
  >([]);
  const [todosLosProductos, setTodosLosProductos] = useState<any[]>([]);
  const [articuloManufacturadoPromocion, setArticuloManufacturadoPromocion] =
    useState<IArticuloManufacturadoPromocion[]>([]);
  const { setState } = useModalContext();
  const traducirEnum = useDiccionarioEnum();

  const openModal = () => {
    setState(true);
  };

  async function obtenerProductosParaVenta() {
    // Asegúrate de usar la URL completa apuntando al endpoint de sucursal
    const urlMan = `${apiUrl}articulosManufacturados/activos/porSucursal/${sucursalId}`;
    const urlInsumo = `${apiUrl}articulosInsumos/activos/porSucursal/${sucursalId}`;

    // Usamos fetch directo o tu servicio si tiene un método para esto
    try {
      const [resMan, resInsumo] = await Promise.all([
        fetch(urlMan).then((r) => r.json()),
        fetch(urlInsumo).then((r) => r.json()),
      ]);

      // Normalizamos como antes
      const manNormalizados = (Array.isArray(resMan) ? resMan : []).map(
        (p) => ({
          id: p.id,
          denominacion: p.denominacion,
          value: p.id,
          label: p.denominacion,
        }),
      );

      const insNormalizados = (Array.isArray(resInsumo) ? resInsumo : [])
        .filter((i: IArticuloInsumo) => !i.esParaElaborar === true)
        .map((i) => ({
          id: i.id,
          denominacion: i.denominacion,
          value: i.id,
          label: i.denominacion,
        }));

      setTodosLosProductos([...manNormalizados, ...insNormalizados]);
    } catch (error) {
      console.error("Error al cargar productos por sucursal:", error);
    }
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      console.log("No file selected");
      return;
    }

    // Mostrar la nueva imagen en una etiqueta img
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl); // Establece la imagen seleccionada
    console.log("File uploaded: ", imageUrl);
  };

  useEffect(() => {
    if (promocion.imagenes?.length) {
      const firstImageUrl = promocion.imagenes[0].url;
      setSelectedImage(firstImageUrl); // Establece la imagen inicial desde los datos
    }
  }, [promocion.imagenes]);

  const getPromocionById = async (id: number) => {
    const result = new PromocionService(`${apiUrl}promociones`);
    const data = await result.get(id);

    if (data) {
      console.log("PROMO DATA:", data); // 👈 Acá podés ver en consola cómo viene // Verifica qué valor tiene

      setPromocion(data);
      // Si tiene detalles (artículos), también los podés setear
      const detalles = data.promocionDetalles.map(
        (detalle: IPromocionDetalle) => ({
          id: detalle.articulo.id,
          denominacion: detalle.articulo.denominacion,
          cantidad: detalle.cantidad,
        }),
      );
      setArticuloManufacturadoPromocion(detalles);
    }
  };

  const handleCantidadChange = (id: number, nuevaCantidad: number) => {
    setArticuloManufacturadoPromocion((prevArticulos) =>
      prevArticulos.map(
        (articulo) =>
          articulo.id === id
            ? {
                ...articulo,
                cantidad: isNaN(nuevaCantidad) ? 1 : nuevaCantidad,
              } // Actualiza la cantidad si el ID coincide, maneja NaN
            : articulo, // Mantiene el artículo sin cambios si el ID no coincide
      ),
    );
  };

  const guardarPromocion = async (event?: React.MouseEvent) => {
    if (event) event.preventDefault();

    if (new Date(promocion.fechaDesde) > new Date(promocion.fechaHasta)) {
      alert("La fecha de inicio debe ser anterior a la de finalización");
      return;
    }

    const currentImageUrl = promocion.imagenes?.length
      ? promocion.imagenes[0].url
      : null;
    const isNewImage = selectedImage && selectedImage !== currentImageUrl;

    const detallePromocion: IPromocionDetalle[] =
      articuloManufacturadoPromocion.map((articulo) => ({
        id: 0,
        baja: false,
        cantidad: articulo.cantidad,
        articulo: {
          id: articulo.id,
          denominacion: articulo.denominacion,
        },
      }));

    const tipoTraducido = traducirEnum(promocion.tipoPromocion);

    const promocionConSucursal: IPromocion = {
      ...promocion,
      tipoPromocion: tipoTraducido as TipoPromocion, // asegurás el tipo
      promocionDetalles: detallePromocion,
      idsSucursal: sucursalId!,
    };

    // 💡 Si no hay una nueva imagen, eliminamos el campo "imagenes"
    const promocionAEnviar: IPromocion = { ...promocionConSucursal };

    // Si no hay nueva imagen, mantené la imagen actual
    if (!isNewImage && promocion.imagenes?.length) {
      promocionAEnviar.imagenes = [...promocion.imagenes];
    }

    try {
      let promocionId = Number(id);
      const promService = new PromocionService(`${apiUrl}promociones`);

      // 🚨 PASO 1: Si hay una nueva imagen, LA SUBIMOS PRIMERO
      if (isNewImage) {
        try {
          const blob = await fetch(selectedImage).then((res) => res.blob());
          const file = new File([blob], "imagen.jpg", { type: "image/jpeg" });
          const formData = new FormData();
          formData.append("uploads", file);

          // Subimos la imagen pasándole el ID actual (si es edición) o 0 (si es nueva)
          const result = new ImagenPromocionService(
            `${apiUrl}imagenesPromocion/uploads`,
          );
          const uploadedImage = await result.postImagen(formData, promocionId);

          if (uploadedImage && uploadedImage.id) {
            // Inyectamos la NUEVA imagen en el objeto que vamos a guardar
            promocionAEnviar.imagenes = [
              {
                id: uploadedImage.id,
                url: uploadedImage.url,
              },
            ];
            console.log(
              "Nueva imagen lista para enviarse en el JSON:",
              uploadedImage,
            );
          } else {
            console.error(
              "Error en la subida de imagen: No se recibió ID válido.",
            );
            alert(
              "Error al subir la nueva imagen. La promoción no será guardada.",
            );
            return;
          }
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          alert(
            "Error al subir la nueva imagen. La promoción no será guardada.",
          );
          return;
        }
      }

      // 🚨 PASO 2: Eliminar la imagen anterior del servidor de almacenamiento (si corresponde)
      if (isNewImage && currentImageUrl && promocion.imagenes?.length) {
        const publicIdToDelete = currentImageUrl.split("/")[6].split(".")[0];
        try {
          const resultDelete = new ImagenPromocionService(
            `${apiUrl}imagenesPromocion`,
          );
          await resultDelete.deleteImagen(
            publicIdToDelete,
            promocion.imagenes[0].id,
          );
          console.log("Imagen anterior eliminada correctamente del servidor");
        } catch (error) {
          console.error("Error al eliminar la imagen anterior:", error);
          // Opcional: Podés decidir si frenar o dejar que continúe
        }
      }

      // 🚨 PASO 3: AHORA SÍ, enviamos el JSON definitivo con la nueva imagen incluida
      console.log("JSON final enviado a la Base de Datos:", promocionAEnviar);

      if (promocionId !== 0) {
        await promService.put(promocionId, promocionAEnviar);
        alert("¡Promoción modificada con éxito!");
      } else {
        const nuevaPromo = await promService.post(promocionAEnviar);
        promocionId = nuevaPromo.id;
        alert("¡Promoción creada con éxito!");
      }
    } catch (error) {
      console.error("Error al guardar la promoción:", error);
      alert("Ocurrió un error al guardar los datos.");
    }
  };

  useEffect(() => {
    obtenerProductosParaVenta();
    const idNum = Number(id);
    if (!isNaN(idNum) && idNum !== 0) getPromocionById(idNum);
  }, [id]);

  return (
    <div className="container mt-4 mb-5">
      <Link
        to="/panel-usuario/promociones"
        className="btnVolver mb-3 d-flex align-items-center gap-2"
      >
        <img width={24} height={24} src={arrow_left} alt="volver" />
        Volver
      </Link>

      <form className="card p-4 shadow-sm">
        <h2 className="mb-4">Gestionar Promoción</h2>

        {/* Grid de 2 columnas para el formulario */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <label className="form-label">Denominación</label>
            <input
              type="text"
              className="form-control"
              value={promocion.denominacion}
              onChange={(e) =>
                setPromocion({ ...promocion, denominacion: e.target.value })
              }
            />
          </div>
          <div>
            <label className="form-label">Descripción del descuento</label>
            <input
              type="text"
              className="form-control"
              value={promocion.descripcionDescuento}
              onChange={(e) =>
                setPromocion({
                  ...promocion,
                  descripcionDescuento: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="form-label">Precio Promocional ($)</label>
            <input
              type="number"
              className="form-control"
              value={promocion.precioPromocional}
              onChange={(e) =>
                setPromocion({
                  ...promocion,
                  precioPromocional: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="form-label">Tipo de Promoción</label>
            <select
              className="form-select"
              value={promocion.tipoPromocion}
              onChange={(e) =>
                setPromocion({
                  ...promocion,
                  tipoPromocion: e.target.value as TipoPromocion,
                })
              }
            >
              {Object.values(TipoPromocion).map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          {/* Fechas */}
          <div>
            <label className="form-label">Fecha Inicio</label>
            <input
              type="date"
              className="form-control"
              value={formatDate(promocion.fechaDesde)}
              onChange={(e) =>
                setPromocion({
                  ...promocion,
                  fechaDesde: new Date(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="form-label">Fecha Fin</label>
            <input
              type="date"
              className="form-control"
              value={formatDate(promocion.fechaHasta)}
              onChange={(e) =>
                setPromocion({
                  ...promocion,
                  fechaHasta: new Date(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* Imagen */}
        <div className="mt-4">
          <label className="form-label">Imagen de la Promoción</label>
          <input type="file" className="form-control" onChange={onFileChange} />
          {selectedImage && (
            <img
              src={selectedImage}
              alt="preview"
              className="mt-2"
              style={{ width: "120px", borderRadius: "8px" }}
            />
          )}
        </div>

        {/* SECCIÓN ARTÍCULOS */}
        <h4 className="mt-5 mb-3">Artículos incluidos</h4>
        <div
          className="row border rounded p-3"
          style={{ background: "#f8f9fa" }}
        >
          {/* COLUMNA IZQUIERDA: Selector Nativo */}
          <div className="col-md-6">
            <label className="form-label">Buscar y agregar:</label>
            {todosLosProductos.length > 0 ? (
              <select
                className="form-select"
                onChange={(e) => {
                  const idSeleccionado = Number(e.target.value);
                  const producto = todosLosProductos.find(
                    (p) => p.id === idSeleccionado,
                  );

                  if (
                    producto &&
                    !articuloManufacturadoPromocion.find(
                      (a) => a.id === idSeleccionado,
                    )
                  ) {
                    setArticuloManufacturadoPromocion([
                      ...articuloManufacturadoPromocion,
                      {
                        id: producto.id,
                        denominacion: producto.denominacion,
                        cantidad: 1,
                      },
                    ]);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccione un artículo...
                </option>
                {todosLosProductos.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.denominacion}
                  </option>
                ))}
              </select>
            ) : (
              <p>Cargando lista...</p>
            )}
          </div>

          {/* COLUMNA DERECHA: Lista de elegidos */}
          <div className="col-md-6">
  <label className="form-label">Cantidades:</label>
  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
    {articuloManufacturadoPromocion.length === 0 && (
      <p className="text-muted text-center">No hay artículos agregados.</p>
    )}

    {articuloManufacturadoPromocion.map((art) => (
      <div
        key={art.id}
        className="p-2 bg-white border mb-3 rounded shadow-sm"
      >
        {/* FILA 1: Nombre del producto (Ocupa todo el ancho) */}
        <div style={{ fontWeight: "600", fontSize: "0.95rem", marginBottom: "8px", wordBreak: "break-word" }}>
          {art.denominacion}
        </div>

        {/* FILA 2: Controles alineados a la derecha */}
        <div className="d-flex align-items-center justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => handleCantidadChange(art.id, Math.max(1, (art.cantidad || 1) - 1))}
          >
            -
          </button>
          
          <span style={{ width: "30px", textAlign: "center", fontWeight: "bold" }}>
            {art.cantidad || 1}
          </span>
          
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => handleCantidadChange(art.id, (art.cantidad || 1) + 1)}
          >
            +
          </button>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm ms-2"
            onClick={() => setArticuloManufacturadoPromocion(articuloManufacturadoPromocion.filter((a) => a.id !== art.id))}
            title="Eliminar artículo"
          >
            🗑️
          </button>
        </div>
      </div>
    ))}
  </div>
</div>SCD
        </div>

        <div className="mt-4 d-flex justify-content-end">
          <ButtonPrimary
            label="Guardar Promoción"
            customMethod={guardarPromocion}
          />
        </div>
      </form>
    </div>
  );
}
