import imagenEmpresa from "../assets/imagenes/empresa.jpg";
import deleteRed from "../assets/delete-red.svg";
import activeCyan from "../assets/checkmark-cyan-2.svg";
import eyeCloseDarkBlue from "../assets/eye-closed-dark-blue.svg";
import eyeBlue from "../assets/eye-blue.svg";
import { useState } from "react";
import ISucursalDto from "../Entities/ISucursalDto";
import { Modal } from "react-bootstrap";
import { useSucursal } from "../context/SucursalContext"; // ⬅️ importá el contexto

export default function CardSucursalDashboard(props: { data: ISucursalDto }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [hover, setHover] = useState(false);

  const handleHover = () => setHover(!hover);

  const { setSucursal } = useSucursal();

//   const handleSeleccionarSucursal = () => {
//     setSucursal(props.data.id, props.data.nombre);
//     alert(`Sucursal "${props.data.nombre}" seleccionada`);
//   };

  return (
    <div className="cardEmpresa">
      <div>
        <img src={imagenEmpresa} alt={props.data.nombre} />
      </div>
      <div className="cardEmpresaBody">
        <div className="cardEmpresaBody-title">
          {props.data.baja ? (
            <div className="chip-default chip-delete">
              <img width="24" height="24" src={deleteRed} alt="Inactivo" />
              <div>Inactivo</div>
            </div>
          ) : (
            <div className="chip-active chip-default">
              <img width="24" height="24" src={activeCyan} alt="Activo" />
              <div>Activo</div>
            </div>
          )}
          <p>{props.data.nombre}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
          {/* Botón Ver */}
          <div
            onClick={() => setIsOpenModal(true)}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
            className={`image-container ${hover && "eyeBlue"}`}
            style={{ cursor: "pointer" }}
          >
            <img
              width={24}
              height={24}
              src={hover ? eyeBlue : eyeCloseDarkBlue}
              alt="Ver detalles"
            />
            <span>Ver</span>
          </div>

          {/* Botón Seleccionar */}
            <button
                className="btn btn-outline-primary"
                onClick={() => setSucursal(props.data.id, props.data.nombre)}
                >
                Seleccionar
            </button>
        </div>

        {/* Modal de detalles */}
        <Modal show={isOpenModal} onHide={() => setIsOpenModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Detalle de Sucursal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{props.data.nombre}</h5>
            <p><strong>Horario:</strong> {props.data.horarioApertura} hs - {props.data.horarioCierre} hs</p>
            <p><strong>Casa matriz:</strong> {props.data.esCasaMatriz ? "Sí" : "No"}</p>
            <p><strong>Domicilio:</strong> {props.data.domicilio.calle} {props.data.domicilio.numero} - {props.data.domicilio.localidad.nombre}, {props.data.domicilio.localidad.provincia.nombre}</p>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
