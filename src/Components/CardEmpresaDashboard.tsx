import imagenEmpresa from "../assets/imagenes/empresa.jpg";
import deleteRed from "../assets/delete-red.svg";
import activeCyan from "../assets/checkmark-cyan-2.svg";
import IEmpresa from "../Entities/IEmpresa";
import useModal from "../Hooks/useModal";
import eyeCloseDarkBlue from "../assets/eye-closed-dark-blue.svg";
import eyeBlue from "../assets/eye-blue.svg";
import addCyan from "../assets/add-cyan.svg"
import { useState } from "react";
import ModalWatchSucursales from "./ModalWatchSucursales";
import ModalAddSucursales from "./ModalAddSucursales";


export default function CardEmpresaDashboard(props: { data: IEmpresa }) {
    const [isOpenModal, openModal, closeModal] = useModal(false);
    const [isOpenModalAdd, openModalAdd, closeModalAdd] = useModal(false);

    const [hover, setHover] = useState(false);

    const handleHover = () => {
        setHover(!hover);
    }

    return (
        <div className="cardEmpresa">
            <div>
                <img src={imagenEmpresa} alt={props.data.nombre} />
            </div>
            <div className="cardEmpresaBody">
                <div className="cardEmpresaBody-title">
                    {
                        props.data.baja ? (
                            <div className="chip-default chip-delete">
                                <img width="24" height="24" src={deleteRed} alt="deleteRed" />
                                <div>Inactivo</div>
                            </div>
                        ) : (
                            <div className="chip-active chip-default">
                                <img width="24" height="24" src={activeCyan} alt="activeCyan" />
                                <div>Activo</div>
                            </div>
                        )
                    }
                    <p>{props.data.nombre}</p>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div onClick={openModal} onMouseEnter={handleHover} onMouseLeave={handleHover} className={`image-container ${hover && "eyeBlue"}`}>
                        {
                            !hover ? (
                                <img width={24} height={24} src={eyeCloseDarkBlue} alt="eyeCloseDarkBlue" />
                            )
                                : (
                                    <img width={24} height={24} src={eyeBlue} alt="eyeBlue" />
                                )
                        }
                        <span>Ver</span>
                    </div>
                    <div>
                    <div onClick={openModalAdd} className={`image-container`}>
                        <img width={24} height={24} src={addCyan} alt="" />
                        <span>Añadir</span>
                    </div>
                    </div>
                </div>

                <ModalWatchSucursales isOpen={isOpenModal} closeModal={closeModal} idEmpresa={props.data.id}></ModalWatchSucursales>
                <ModalAddSucursales isOpen={isOpenModalAdd} closeModal={closeModalAdd}></ModalAddSucursales>
            </div>
        </div>
    )
}