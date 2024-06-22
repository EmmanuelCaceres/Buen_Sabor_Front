import { createPortal } from "react-dom"
import cruz_blue from "../assets/cruz-azul.svg"
import { useState } from "react";
import ILocalidad from "../Entities/ILocalidad";
import IProvincia from "../Entities/IProvincia";
import ProvinciaService from "../Functions/Services/ProvinciaService";
import LocalidadService from "../Functions/Services/LocalidadService";
import ISucursalDto from "../Entities/ISucursalDto";


interface ModalAddSucursalesProps {
    isOpen: boolean;
    closeModal: () => void;
}

export default function ModalAddSucursales({ isOpen, closeModal }: ModalAddSucursalesProps) {

    const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
    const [provincias, setProvincias] = useState<IProvincia[]>([]);

    const [sucursal, setSucursal] = useState<ISucursalDto>(
        {
            id: 0,
            nombre: '',
            horarioApertura: '',
            horarioCierre: '',
            baja: false,
            casaMatriz: false,
            domicilio: {
                id: 0,
                baja: false,
                calle: '',
                numero: 0,
                cp: 0,
                piso: 0,
                nroDpto: 0,
                localidad: {
                    id: 0,
                    baja: false,
                    nombre: '',
                    provincia: {
                        id: 0,
                        baja: false,
                        nombre: '',
                        pais: {
                            id: 1,
                            baja: false,
                            nombre: 'Argentina'
                        }

                    }
                }
            }
        }
    );

    const handleModalContainer = (e: any) => e.stopPropagation();

    const getAllProvincias = () => {
        const result = new ProvinciaService("http://localhost:8080/provincias/findByPais/")
        result.getProvinciasByPais(1)
            .then(data => {
                if (data !== null) {
                    setProvincias(data);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleSelect = () => {
        getAllProvincias();
    }
    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const provinciaNombre = event.target.value;

        const provincia = provincias.find(prov => prov.nombre === provinciaNombre);

        if (provincia) {
            const result = new LocalidadService("http://localhost:8080/localidades/findByProvincia/")
            result.getLocalidadesByProvincia(provincia.id)
                .then(data => {
                    if (data !== null) {
                        console.log(data);
                        setLocalidades(data);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    };
    // const agregarInsumo = (insumo: IArticuloInsumo) => {
    //     const existeInsumo = articuloManufacturado.articuloManufacturadoDetalles.find((insumoDetalle) => insumoDetalle.articuloInsumo.id === insumo.id)
    //     if (existeInsumo) {
    //         alert("El insumo ya existe en el arreglo");
    //     } else {
    //         const nuevoDetalle: IArticuloManufacturadoDetalles = {
    //             id: 0,
    //             cantidad: 0,
    //             articuloInsumo: insumo
    //         };
    //         setArticulosManufacturado(prevState => ({
    //             ...prevState,
    //             articuloManufacturadoDetalles: [...prevState.articuloManufacturadoDetalles, nuevoDetalle]
    //         }));
    //     }
    // };

    // const getAllCategories = async () => {

    // }

    return createPortal(
        <article className={`modalPropio ${isOpen && 'is-open'}`} onClick={closeModal}>
            <div className="container" style={{ maxHeight: "649px", minHeight: "649px" }} onClick={handleModalContainer}>
                <div className="modalPropio-close" onClick={closeModal}>
                    <img width={32} height={32} src={cruz_blue} alt="curzAzul" />
                </div>

                <div>
                    <form action="" className="formContainer">

                        <label htmlFor="nombre">Nombre de la empresa</label>
                        <input type="text" id="nombre" name="nombre" value={sucursal.nombre} onChange={(e) => setSucursal({ ...sucursal, nombre: e.target.value })} />
                        <label htmlFor="horarioApert">Razon social</label>
                        <input type="text" id="horarioApert" name="horarioApert" value={sucursal?.horarioApertura} onChange={(e) => setSucursal({ ...sucursal, horarioApertura: e.target.value })} />
                        <label htmlFor="horarioClose">Cuil</label>
                        <input type="number" id="horarioClose" name="horarioClose" value={sucursal?.horarioCierre} onChange={(e) => setSucursal({ ...sucursal, horarioCierre: e.target.value })} />

                        <select name="provincia" id="provincia" defaultValue={"Elija una opcion"} onClick={handleSelect} onChange={handleSelectChange}>
                            <option disabled value="opcion">Elija una opcion</option>
                            {
                                provincias && provincias.map((provincia: IProvincia, key = provincia.id) => (
                                    <option key={key} value={provincia.nombre}>{provincia.nombre}</option>
                                ))
                            }
                        </select>
                    </form>
                    <ul>
                        {localidades && localidades.map(localidad => (
                            <li key={localidad.id}>{localidad.nombre}</li>
                        ))}
                    </ul>
                </div>

            </div>
        </article>,
        document.body
    )
}