import { useEffect, useState } from "react";
import ISucursalDto from "../../Entities/ISucursalDto"; // Asegúrate de tener esta interfaz
import "./ModalSucursal.css";

interface ModalSucursalProps {
  onSelect: (id: number) => void;
}

export const ModalSucursal = ({ onSelect }: ModalSucursalProps) => {
  const [sucursales, setSucursales] = useState<ISucursalDto[]>([]);
  const apiUrl = import.meta.env.VITE_URL_API_BACK;

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch(`${apiUrl}sucursales`);
        const data = await response.json();
        setSucursales(data);
      } catch (error) {
        console.error("Error al cargar sucursales:", error);
      }
    };
    fetchSucursales();
  }, [apiUrl]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bienvenido a Buen Sabor</h2>
        <p>Por favor, selecciona la sucursal más cercana para ver nuestro menú:</p>
        
        <div className="sucursal-grid">
          {sucursales.map((sucursal) => (
            <button 
              key={sucursal.id} 
              className="sucursal-card"
              onClick={() => onSelect(sucursal.id)}
            >
              <h3>{sucursal.nombre}</h3>
              <p>{sucursal.domicilio.calle} {sucursal.domicilio.numero}</p>
              <small>{sucursal.horarioApertura} - {sucursal.horarioCierre}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};