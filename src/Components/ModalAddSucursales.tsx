import { createPortal } from "react-dom"
import cruz_blue from "../assets/cruz-azul.svg"
import { useState } from "react";
import ILocalidad from "../Entities/ILocalidad";
import IProvincia from "../Entities/IProvincia";
import ProvinciaService from "../Functions/Services/ProvinciaService";
import LocalidadService from "../Functions/Services/LocalidadService";
import PaisService from "../Functions/Services/PaisService";
import ISucursalDto from "../Entities/ISucursalDto";
import IPais from "../Entities/IPais";


interface ModalAddSucursalesProps {
    isOpen: boolean;
    closeModal: () => void;
}

export default function ModalAddSucursales({ isOpen, closeModal }: ModalAddSucursalesProps) {

    const apiUrl = import.meta.env.VITE_URL_API_BACK
    const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
    const [provincias, setProvincias] = useState<IProvincia[]>([]);
    const [paises, setPaises] = useState<IPais[]>([]);

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

    const getAllPaises = () => {
        const result = new PaisService(`${apiUrl}paises/`)
        result.getPaises()
            .then(data => {
                if (data !== null) {
                    setPaises(data);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    

    const getAllProvincias = () => {
        const result = new ProvinciaService(`${apiUrl}provincias/findByPais/`)
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

    const handlePaisSelect = () => {
        getAllPaises();
    }

    const handleSelect = () => {
        getAllProvincias();
    }
    
    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const provinciaNombre = event.target.value;
    
        const provincia = provincias.find(prov => prov.nombre === provinciaNombre);
    
        if (provincia) {
            const result = new LocalidadService(`${apiUrl}localidades/findByProvincia/`)
            result.getLocalidadesByProvincia(provincia.id)
                .then(data => {
                    if (data !== null) {
                        setLocalidades(data);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    const handleSelectPaisChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const paisNombre = event.target.value;
    
        const pais = paises.find(p => p.nombre === paisNombre);
    
        if (pais) {
            const result = new ProvinciaService(`${apiUrl}provincias/findByPais/`)
            result.getProvinciasByPais(pais.id)
                .then(data => {
                    if (data !== null) {
                        setProvincias(data);
                        setLocalidades([]);  // Limpiar localidades cuando se selecciona un nuevo país
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    const handleSelectLocalidadChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const localidadNombre = event.target.value;
    
        const localidad = localidades.find(loc => loc.nombre === localidadNombre);
    
        if (localidad) {
            setSucursal({ ...sucursal, domicilio: { ...sucursal.domicilio, localidad } });
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
                        <label htmlFor="nombre">Nombre de la sucursal</label>
                        <input type="text" id="nombre" name="nombre" value={sucursal.nombre} onChange={(e) => setSucursal({ ...sucursal, nombre: e.target.value })} />
    
                        <label htmlFor="horarioApert">Horario Apertura</label>
                        <input type="text" id="horarioApert" name="horarioApert" value={sucursal?.horarioApertura} onChange={(e) => setSucursal({ ...sucursal, horarioApertura: e.target.value })} />
    
                        <label htmlFor="horarioClose">Horario Cierre</label>
                        <input type="text" id="horarioClose" name="horarioClose" value={sucursal?.horarioCierre} onChange={(e) => setSucursal({ ...sucursal, horarioCierre: e.target.value })} />
    
                        <label htmlFor="casaMatriz">¿Es casa matriz?</label>
                        <input type="checkbox" id="casaMatriz" name="casaMatriz" checked={sucursal.casaMatriz} onChange={(e) => setSucursal({ ...sucursal, casaMatriz: e.target.checked })} />
    
                        <label htmlFor="pais">País</label>
                        <select name="pais" id="pais" defaultValue="Elija un país" onClick={handlePaisSelect} onChange={handleSelectPaisChange}>
                            <option disabled value="Elija un país">Elija un país</option>
                            {paises && paises.map((pais: IPais, key = pais.id) => (
                                <option key={key} value={pais.nombre}>{pais.nombre}</option>
                            ))}
                        </select>
    
                        <label htmlFor="provincia">Provincia</label>
                        <select name="provincia" id="provincia" defaultValue="Elija una provincia" onClick={handleSelect} onChange={handleSelectChange}>
                            <option disabled value="Elija una provincia">Elija una provincia</option>
                            {provincias && provincias.map((provincia: IProvincia, key = provincia.id) => (
                                <option key={key} value={provincia.nombre}>{provincia.nombre}</option>
                            ))}
                        </select>
    
                        <label htmlFor="localidad">Localidad</label>
                        <select name="localidad" id="localidad" defaultValue="Elija una localidad" onChange={handleSelectLocalidadChange}>
                            <option disabled value="Elija una localidad">Elija una localidad</option>
                            {localidades && localidades.map((localidad: ILocalidad, key = localidad.id) => (
                                <option key={key} value={localidad.nombre}>{localidad.nombre}</option>
                            ))}
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
    );
    
}