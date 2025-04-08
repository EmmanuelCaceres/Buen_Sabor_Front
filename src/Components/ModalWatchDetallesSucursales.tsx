import { createPortal } from "react-dom";
import cruz_blue from "../assets/cruz-azul.svg";
import ISucursalDto from "../Entities/ISucursalDto";
import "./modalWatchDetallesSucursal.css";

interface ModalWatchSucursalesProps {
  isOpen: boolean;
  closeModal: () => void;
  sucursales: ISucursalDto[];
}

export default function ModalWatchDetallesSucursales({
  isOpen,
  closeModal,
  sucursales,
}: ModalWatchSucursalesProps) {
    const handleModalContainer = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();


  return createPortal(
    <article className={`modalPropio ${isOpen ? "is-open" : ""}`} onClick={closeModal}>
      <div className="container" onClick={handleModalContainer}>
        <div className="modalPropio-close" onClick={closeModal}>
          <img width={32} height={32} src={cruz_blue} alt="Cerrar" />
        </div>
        <h2>Detalles de Sucursales</h2>
        <div className="sucursal-lista">
          {sucursales.map((sucursal) => (
            <table className="tabla-sucursal">
            <tbody>
              <tr>
                <td className="label">Nombre:</td>
                <td className="value">{sucursal.nombre}</td>
              </tr>
              <tr>
                <td className="label">Horario apertura:</td>
                <td className="value">{sucursal.horarioApertura} hs</td>
              </tr>
              <tr>
                <td className="label">Horario cierre:</td>
                <td className="value">{sucursal.horarioCierre} hs</td>
              </tr>
              <tr>
                <td className="label">Casa matriz:</td>
                <td className="value">{sucursal.casaMatriz ? "Sí" : "No"}</td>
              </tr>
              <tr>
                <td className="label">Domicilio:</td>
                <td className="value">
                  {sucursal.domicilio.calle} {sucursal.domicilio.numero} - {sucursal.domicilio.localidad.nombre},{" "}
                  {sucursal.domicilio.localidad.provincia.nombre}
                </td>
              </tr>
            </tbody>
          </table>
          
          ))}
        </div>
      </div>
    </article>,
    document.body
  );
}
