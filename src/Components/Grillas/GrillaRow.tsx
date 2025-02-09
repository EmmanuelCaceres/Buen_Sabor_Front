import { useState } from "react";
import { ButtonEdit } from "../../Components";
import './GrillaRow.css'

// Tipado de la fila con un tipo genérico
interface InfoRow<T extends { id: number }> {
    data: T;
    propertiesToShow: (keyof T)[]; // Propiedades a mostrar
    isActions: boolean;
    urlParent?: string;
    onDelete?: (id: number) => void;
}

// Tipado del Modal con el mismo tipo de datos que la fila
interface ModalProps<T> {
    isOpen: boolean;
    data: T; // Ahora 'data' tiene el tipo genérico
    onClose: () => void;
}

const Modal = <T extends { id: number }>({ isOpen, data, onClose }: ModalProps<T>) => {
    if (!isOpen) return null;

    const formatValue = (value: unknown): string => {
    
        if (Array.isArray(value)) {

            if (value.length === 0) {
                return "No tiene"; // Si el array está vacío, mostrar "No tiene"
            }
            
            return value.map((item) => {
                if (typeof item === "object" && item !== null) {
                    console.log("Objeto dentro del array:", item); // Vemos qué propiedades tiene
    
                    return (item as { nombre?: string; denominacion?: string }).nombre 
                        || (item as { nombre?: string; denominacion?: string }).denominacion 
                        || JSON.stringify(item);
                }
                return String(item);
            }).join(", ");
        } else if (typeof value === "boolean") {
            return value ? "Sí" : "No";
        } else if (value === null || value === undefined) {
            return "No tiene";
        } else if (typeof value === "object" && value !== null) {
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    };

    

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Detalles del Elemento</h3>
                <ul>
                    {Object.entries(data).map(([key, value]) => (
                        <li key={key}><strong>{key}:</strong> {formatValue(value)}</li>
                    ))}
                </ul>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default function GrillaRow<T extends { id: number }>({
    data,
    propertiesToShow,
    isActions,
    onDelete,
    urlParent,
}: InfoRow<T>) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    return (
        <>
            <tr>
                {propertiesToShow.map((property, index) => (
                    <td key={index}>{String(data[property])}</td>
                ))}
                {isActions && (
                    <td>
                        <button className="ver" onClick={handleModalOpen}>Ver</button>
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
            <Modal isOpen={isModalOpen} data={data} onClose={handleModalClose} />
        </>
    );
}
