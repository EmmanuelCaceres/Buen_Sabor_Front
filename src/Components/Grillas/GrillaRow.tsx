import { ButtonEdit } from "../../Components";
import './GrillaRow.css'
import useModal from "../../Hooks/useModal";
import { Modal } from "../../Components";
import { ModalContext, useModalContext } from "../Modal/context/ModalContext";

// Tipado de la fila con un tipo genérico
interface InfoRow<T extends { id: number }> {
    data: T;
    propertiesToShow: (keyof T)[]; // Propiedades a mostrar
    isActions: boolean;
    urlParent?: string;
    onDelete?: (id: number) => void;
}

interface ComplexValue {
    Denominación?: string;
    nombre?: string;
    denominacion?: string;
    url?: string;
    [key: string]: any; // Esto permite que tenga otras propiedades que no hemos especificado
}

// Función para formatear valores de propiedades complejas
const formatValue = (value: unknown): string => {
    if (Array.isArray(value)) {
        if (value.length === 0) return "No tiene";
        return value.map((item) => {
            if (typeof item === "object" && item !== null) {
                return formatComplexValue(item); // Reutiliza lógica para objetos
            }
            return String(item);
        }).join(", ");
    } else if (typeof value === "boolean") {
        return value ? "Sí" : "No";
    } else if (value === null || value === undefined) {
        return "No tiene";
    } else if (typeof value === "object" && value !== null) {
        return formatComplexValue(value); // Formatear objetos complejos
    }
    return String(value);
};

// Función para formatear objetos complejos de forma inteligente
const formatComplexValue = (value: ComplexValue): string => {
    if ('Denominación' in value) return value.Denominación || "No tiene denominación";
    if ('nombre' in value) return value.nombre || "No tiene nombre";
    if ('denominacion' in value) return value.denominacion || "No tiene denominación";
    if ('url' in value) return value.url || "No tiene imagen";
    return JSON.stringify(value, null, 2); // Si no se reconoce la propiedad, lo formateamos como JSON
};

export default function GrillaRow<T extends { id: number }>({
    data,
    propertiesToShow,
    isActions,
    onDelete,
    urlParent,
}: InfoRow<T>) {

    // const [isOpen,openModal,closeModal] = useModal(false)
    const {setState} = useModalContext();
    const openModal = () =>{
        setState(true)
    }

    return (
        <>
            <tr>
                {propertiesToShow.map((property, index) => {
                    const value = data[property];
                    return (
                        <td key={index}>
                            {property === "Imagen" && Array.isArray(value) && value.length > 0 ? (
                                <img src={value[0].url} alt="Imagen" width="50" height="50" />
                            ) : (
                                // Muestra un valor formateado para objetos o arrays
                                formatValue(value)
                            )}
                        </td>
                    );
                })}
                {isActions && (
                    <td>
                        <button className="ver" onClick={openModal}>Ver</button>
                        <ButtonEdit label="Editar" url={urlParent ? `${urlParent}${data.id}` : "#"} />
                        <button
                            className="btn btn-danger"
                            onClick={() => onDelete && onDelete(data.id)}
                        >
                            Eliminar
                        </button>
                    </td>
                )}
            </tr>

            {/* Modal fuera de la tabla */}
            <Modal children={
                <>
                    <h3>Detalles</h3>
                    <ul style={{listStyle:"none",padding:"0"}}>

                        {Object.entries(data)
                            .filter(([key]) => key !== "Imagen") // Filtramos la propiedad Imagen
                            .map(([key, value]) => (
                                <li key={key}>{formatValue(value)}</li>
                            ))}
                    </ul>
                </>
                    
            }/>

        </>
    );
}
