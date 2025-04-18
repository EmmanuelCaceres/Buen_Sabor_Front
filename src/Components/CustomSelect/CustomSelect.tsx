import { useEffect, useState } from "react";
import IArticuloManufacturado from "../../Entities/IArticuloManufacturado";
import "./CustomSelect.css";
import IArticuloManufacturadoPromocion from "../../Entities/IArticuloManufacturadoPromocion";

interface CustomSelectProps {
    options: any[];
    onChange: (value: IArticuloManufacturadoPromocion[]) => void;
    initialSelected: IArticuloManufacturadoPromocion[];
}

export const CustomSelect = ({ options, onChange,initialSelected}: CustomSelectProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<IArticuloManufacturadoPromocion[]>(initialSelected);
   
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    const seleccionarOpcion = (opcion: IArticuloManufacturado) => {
        console.log(selectedOptions);
        
        const isSelected = selectedOptions.some((item) => item.id === opcion.id);

        if (isSelected) {
        setSelectedOptions((prev) => prev.filter((item) => item.id !== opcion.id));
        } else {
        const newSelection: IArticuloManufacturadoPromocion = {
            id: opcion.id,
            denominacion: opcion.denominacion,
            cantidad: 1,
        };
        setSelectedOptions((prev) => [...prev, newSelection]);
        }
    };
    useEffect(() => {
        onChange(selectedOptions);
    }, [selectedOptions]);
    

    return (
       
        <div className="custom-select">
            <div className="selector-personalizado">
                <div className="selector-cabecera" onClick={toggleOpen}>
                    Selecciona una opción
                    <span className="icono-flecha">{isOpen ? '▲' : '▼'}</span>
                </div>
                {isOpen && (
                    <ul className="selector-lista">
                        {options.map((opcion) => (
                            <li
                            key={opcion.id}
                            className={`selector-opcion ${
                                selectedOptions.some((item) => item.id === opcion.id) ? 'seleccionada' : ''
                            }`}
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