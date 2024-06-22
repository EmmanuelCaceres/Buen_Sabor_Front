import { useEffect, useState } from "react";
import { createPortal } from "react-dom"
import SucursalService from "../Functions/Services/SucursalService";
import cruz_blue from "../assets/cruz-azul.svg"
import ISucursalDto from "../Entities/ISucursalDto";


interface ModalWatchSucursalesProps {
    isOpen: boolean;
    closeModal: () => void;
    idEmpresa: number;
}

export default function ModalWatchSucursales({ isOpen, closeModal, idEmpresa }:ModalWatchSucursalesProps) {
    const apiUrl = import.meta.env.VITE_URL_API_BACK

    const handleModalContainer = (e: any) => e.stopPropagation();

    const [sucursales, setSucursales] = useState<ISucursalDto[]>([]);

    const getSucursalesByEmpresa = (path: string, idEmpresa: number) => {
        const result = new SucursalService(path);
        result.getSucursalesByEmpresa(idEmpresa)
            .then(data => {
                if(data != null){
                    console.log(data);
                    setSucursales(data);
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        getSucursalesByEmpresa(`${apiUrl}sucursales/empresa/`, idEmpresa)
    }, [])


    return createPortal(
        <article className={`modalPropio ${isOpen && 'is-open'}`} onClick={closeModal}>
            <div className="container" style={{ maxHeight: "649px", minHeight: "649px" }} onClick={handleModalContainer}>
                <div className="modalPropio-close" onClick={closeModal}>
                    <img width={32} height={32} src={cruz_blue} alt="curzAzul" />
                </div>
                <div >
                    <table className="grillaSucursales">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Horario de apertura</th>
                                <th>Horario de cierre</th>
                                <th>Casa matriz</th>
                            </tr>
                        </thead>
                        <tbody >
                            {
                                sucursales && sucursales.map((sucursal: ISucursalDto, key = sucursal.id) => (
                                    <tr key={key}>
                                        <td>
                                            <span>{sucursal.nombre}</span>
                                        </td>
                                        <td>
                                            <span>{sucursal.horarioApertura} hs</span>
                                        </td>
                                        <td>
                                            <span>{sucursal.horarioCierre} hs</span>
                                        </td>
                                        <td>
                                            <span>{sucursal.casaMatriz}</span>
                                        </td>
                                    </tr>

                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </article>,
        document.body
    )
}