import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import cruz_blue from "../assets/cruz-azul.svg";
import { useState, useEffect } from "react";
import ILocalidad from "../Entities/ILocalidad";
import IProvincia from "../Entities/IProvincia";
import ProvinciaService from "../Functions/Services/ProvinciaService";
import LocalidadService from "../Functions/Services/LocalidadService";
import PaisService from "../Functions/Services/PaisService";
import ISucursalDto from "../Entities/ISucursalDto";
import IPais from "../Entities/IPais";
import SucursalService from "../Functions/Services/SucursalService";

interface ModalAddSucursalesProps {
    isOpen: boolean;
    closeModal: () => void;
}

export default function ModalAddSucursales({ isOpen, closeModal }: ModalAddSucursalesProps) {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
    const [provincias, setProvincias] = useState<IProvincia[]>([]);
    const [paises, setPaises] = useState<IPais[]>([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const [sucursal, setSucursal] = useState<ISucursalDto>({
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
                        nombre: 'Argentina',
                    },
                },
            },
        },
    });

    useEffect(() => {
        getAllPaises();
    }, []);

    const handleModalContainer = (e: any) => e.stopPropagation();

    const getAllPaises = () => {
        const result = new PaisService(`${apiUrl}paises`);
        result.getPaises()
            .then(data => {
                if (data !== null) {
                    setPaises(data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const getAllProvincias = (paisId: number) => {
        const result = new ProvinciaService(`${apiUrl}provincias/findByPais/`);
        result.getProvinciasByPais(paisId)
            .then(data => {
                if (data !== null) {
                    setProvincias(data);
                    setLocalidades([]); // Clear localidades when new provinces are loaded
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const getAllLocalidades = (provinciaId: number) => {
        const result = new LocalidadService(`${apiUrl}localidades/findByProvincia/`);
        result.getLocalidadesByProvincia(provinciaId)
            .then(data => {
                if (data !== null) {
                    setLocalidades(data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleSelectPaisChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const paisNombre = event.target.value;
        const selectedPais = paises.find(pais => pais.nombre === paisNombre);
        if (selectedPais) {
            getAllProvincias(selectedPais.id);
        }
    };

    const handleSelectProvinciaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const provinciaNombre = event.target.value;
        const selectedProvincia = provincias.find(provincia => provincia.nombre === provinciaNombre);
        if (selectedProvincia) {
            getAllLocalidades(selectedProvincia.id);
        }
    };

    const handleSelectLocalidadChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const localidadNombre = event.target.value;
        const selectedLocalidad = localidades.find(localidad => localidad.nombre === localidadNombre);
        if (selectedLocalidad) {
            setSucursal({ ...sucursal, domicilio: { ...sucursal.domicilio, localidad: selectedLocalidad } });
        }
    };

    const SaveSucursal = async () => {
        if (Number(id) !== 0) {
            await new SucursalService(`${apiUrl}sucursales`).put(Number(id), sucursal);
        } else {
            await new SucursalService(`${apiUrl}sucursales`).post(sucursal);
        }
        alert("Empresa guardada con exito!");
        navigate(-1);
    };

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
                        <input type="text" id="horarioApert" name="horarioApert" value={sucursal.horarioApertura} onChange={(e) => setSucursal({ ...sucursal, horarioApertura: e.target.value })} />

                        <label htmlFor="horarioClose">Horario Cierre</label>
                        <input type="text" id="horarioClose" name="horarioClose" value={sucursal.horarioCierre} onChange={(e) => setSucursal({ ...sucursal, horarioCierre: e.target.value })} />

                        <label htmlFor="casaMatriz">¿Es casa matriz?</label><input type="checkbox" id="casaMatriz" name="casaMatriz" checked={sucursal.casaMatriz} onChange={(e) => setSucursal({ ...sucursal, casaMatriz: e.target.checked })} />

                        <label htmlFor="pais">País</label>
                        <select name="pais" id="pais" defaultValue="Elija un país" onChange={handleSelectPaisChange}>
                            <option disabled value="Elija un país">Elija un país</option>
                            {paises.map((pais) => (
                                <option key={pais.id} value={pais.nombre}>{pais.nombre}</option>
                            ))}
                        </select>

                        <label htmlFor="provincia">Provincia</label>
                        <select name="provincia" id="provincia" defaultValue="Elija una provincia" onChange={handleSelectProvinciaChange}>
                            <option disabled value="Elija una provincia">Elija una provincia</option>
                            {provincias.map((provincia) => (
                                <option key={provincia.id} value={provincia.nombre}>{provincia.nombre}</option>
                            ))}
                        </select>

                        <label htmlFor="localidad">Localidad</label>
                        <select name="localidad" id="localidad" defaultValue="Elija una localidad" onChange={handleSelectLocalidadChange}>
                            <option disabled value="Elija una localidad">Elija una localidad</option>
                            {localidades.map((localidad) => (
                                <option key={localidad.id} value={localidad.nombre}>{localidad.nombre}</option>
                            ))}
                        </select>
                        <button className="btn btn-primary" onClick={SaveSucursal}>Guardar</button>
                    </form>
                </div>
            </div>
        </article>,
        document.body
    );
}
