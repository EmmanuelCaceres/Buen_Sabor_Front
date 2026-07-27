/* eslint-disable react-hooks/rules-of-hooks */
import { ButtonEdit } from "../../Components";
import "./GrillaRow.css";
import { Modal } from "../../Components";
import { useModalContext } from "../Modal/context/ModalContext";
import { useDiccionario } from "../../Hooks/useDiccionario";
import { useState } from "react";
import IArticuloManufacturadoDetalle from "../../Entities/IArticuloManufacturadoDetalle";
import { IPromocionDetalle } from "../../Entities/IPromocionDetalle";
import { useRol } from "../../context/RolContext";

interface InfoRow<T extends { id: number }> {
  data: T;
  propertiesToShow: (keyof T)[];
  isActions: boolean;
  urlParent?: string;
  onDelete?: (id: number) => void;
}

interface ComplexValue {
  Denominación?: string;
  nombre?: string;
  denominacion?: string;
  url?: string;
}

const formatValue = (value: unknown, propertyName?: string): string => {
  // 1. Manejo de Ingredientes
  if (
    propertyName === "articuloManufacturadoDetalles" &&
    Array.isArray(value)
  ) {
    if (value.length === 0) return "Sin ingredientes";
    return value
      .map((item: IArticuloManufacturadoDetalle) => {
        const cant = item.cantidad ?? "";
        const nombre = item.articulo?.denominacion ?? "Ingrediente";
        const medida = item.articulo?.unidadMedida?.denominacion ?? "";
        return `• ${cant} ${medida} de ${nombre}`;
      })
      .join("\n");
  }

  // 2. Manejo de Promociones
  if (propertyName === "promocionDetalles" && Array.isArray(value)) {
    return value
      .map(
        (item: IPromocionDetalle) =>
          `${item.cantidad} x ${item.articulo?.denominacion ?? "Artículo"}`,
      )
      .join("\n");
  }

  // 3. Lógica genérica para otros Arrays (Imágenes, etc.)
  if (Array.isArray(value)) {
    if (value.length === 0) return "No tiene";
    return value
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return formatComplexValue(item as ComplexValue);
        }
        return String(item);
      })
      .join(", ");
  }

  // 4. Otros tipos de datos
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (value === null || value === undefined) return "No tiene";
  if (typeof value === "object")
    return formatComplexValue(value as ComplexValue);

  return String(value);
};

const formatComplexValue = (value: ComplexValue): string => {
  if (value && typeof value === "object" && "url" in value)
    return value.url || "No tiene imagen";
  if ("Denominación" in value)
    return value.Denominación || "No tiene denominación";
  if ("nombre" in value) return value.nombre || "No tiene nombre";
  if ("denominacion" in value)
    return value.denominacion || "No tiene denominación";

  return typeof value === "object" ? "Ver detalles" : String(value);
};

export default function GrillaRow<T extends { id: number }>({
  data,
  propertiesToShow,
  isActions,
  onDelete,
  urlParent,
}: InfoRow<T>) {
  const { setState } = useModalContext();
  const [itemSeleccionado, setItemSeleccionado] = useState<T | null>(null);

  // LÓGICA DE ROLES PARA ACCIONES
  const { rol } = useRol();
  const puedeEditar = rol === "SUPERADMIN" || rol === "ADMIN";

  const openModal = (item: T) => {
    setItemSeleccionado(item);
    setState(true);
  };

  return (
    <>
      <tr>
        {propertiesToShow.map((property, index) => {
          const value = data[property];
          return (
            <td key={index}>
              {property === "imagenes" &&
              Array.isArray(value) &&
              value.length > 0 &&
              value[0]?.url ? (
                <img
                  src={value[0].url}
                  alt="Imagen"
                  width="50"
                  height="50"
                  style={{ objectFit: "contain", display: "block" }}
                />
              ) : property === "imagenPersona" &&
                typeof value === "object" &&
                value !== null &&
                "url" in value ? (
                <img
                  src={(value as { url: string }).url}
                  alt="Imagen"
                  width="70"
                  height="70"
                  style={{ objectFit: "contain", display: "block" }}
                />
              ) : (
                <span style={{ whiteSpace: "pre-line" }}>
                  {formatValue(value, String(property))}
                </span>
              )}
            </td>
          );
        })}

        {/* RENDERIZADO CONDICIONAL DE ACCIONES SEGÚN ROL */}
        {isActions && (
          <td>
            <button
              className="btn btn-info me-1"
              onClick={() => openModal(data)}
            >
              Ver
            </button>
            {puedeEditar && (
              <>
                <ButtonEdit
                  label="Editar"
                  url={urlParent ? `${urlParent}${data.id}` : "#"}
                />
                <button
                  className="btn btn-danger ms-1"
                  onClick={() => onDelete && onDelete(data.id)}
                >
                  Eliminar
                </button>
              </>
            )}
          </td>
        )}
      </tr>

      {itemSeleccionado && (
        <Modal>
          {/* CONTENEDOR PRINCIPAL CON SCROLL Y LÍMITES */}
          <div
            style={{
              padding: "25px",
              maxWidth: "600px",
              width: "90vw",
              maxHeight: "70vh",
              overflowY: "auto",
              backgroundColor: "#fff",
              borderRadius: "12px",
            }}
          >
            <h3
              style={{
                borderBottom: "2px solid #f4f4f4",
                paddingBottom: "15px",
                marginBottom: "20px",
                top: 0,
                backgroundColor: "#fff",
                zIndex: 1,
              }}
            >
              Detalles del Producto
            </h3>

            <ul style={{ listStyle: "none", padding: "0" }}>
              {Object.entries(itemSeleccionado)
                .filter(
                  ([key, value]) =>
                    key !== "id" &&
                    key !== "baja" &&
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== "",
                )
                .map(([key, value]) => {
                  const formattedValue = formatValue(value, key);
                  const isImageUrl =
                    typeof formattedValue === "string" &&
                    formattedValue.startsWith("http");
                  const label = useDiccionario(key) || key;

                  return (
                    <li
                      key={key}
                      style={{
                        marginBottom: "20px",
                        display: "flex",
                        flexDirection: "column",
                        borderBottom: "1px solid #fafafa",
                        paddingBottom: "10px",
                      }}
                    >
                      <strong
                        style={{
                          color: "#888",
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {label}
                      </strong>
                      <div style={{ marginTop: "5px" }}>
                        {isImageUrl ? (
                          <img
                            src={formattedValue}
                            alt={key}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              maxHeight: "250px",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: "1rem",
                              color: "#2c3e50",
                              whiteSpace: "pre-wrap",
                              lineHeight: "1.5",
                            }}
                          >
                            {formattedValue}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
}
