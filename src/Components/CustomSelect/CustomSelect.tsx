import { useState } from "react";
import IArticuloManufacturado from "../../Entities/IArticuloManufacturado";

interface CustomSelectProps {
    options: any[];
    valorSeleccionado?: string;
    onChange: (value: any) => void;
}

export const CustomSelect = ({ options, valorSeleccionado, onChange }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const seleccionarOpcion = (opcion: IArticuloManufacturado) => {
        onChange(opcion);
        setIsOpen(false);
    };
    return (
        <div className="custom-select">
            <div className="selector-personalizado">
                <div className="selector-cabecera" onClick={toggleOpen}>
                    {valorSeleccionado || 'Selecciona una opción'}
                    <span className="icono-flecha">{isOpen ? '▲' : '▼'}</span>
                </div>
                {isOpen && (
                    <ul className="selector-lista">
                        {options.map((opcion) => (
                            <li
                                key={opcion.id}
                                className={`selector-opcion ${opcion.denominacion === valorSeleccionado ? 'seleccionado' : ''}`}
                                onClick={() => seleccionarOpcion(opcion)}
                            >
                                {opcion.denominacion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}