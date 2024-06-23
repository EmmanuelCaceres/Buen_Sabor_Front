import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import cruz_blue from "../assets/cruz-azul.svg";
import ILocalidad from "../Entities/ILocalidad";
import IProvincia from "../Entities/IProvincia";
import IPais from "../Entities/IPais";
import ISucursalDto from "../Entities/ISucursalDto";
import ProvinciaService from "../Functions/Services/ProvinciaService";
import LocalidadService from "../Functions/Services/LocalidadService";
import PaisService from "../Functions/Services/PaisService";
import SucursalService from "../Functions/Services/SucursalService";
import DomicilioService from "../Functions/Services/DomicilioService";
import { Button, ProgressBar } from 'react-bootstrap';

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
    const [step, setStep] = useState(1);

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

    const handleDomicilioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSucursal({
            ...sucursal,
            domicilio: {
                ...sucursal.domicilio,
                [name]: value
            }
        });
    };

    const handleSucursalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSucursal({
            ...sucursal,
            [name]: value
        });
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const SaveSucursal = async () => {
        const domicilioService = new DomicilioService(`${apiUrl}domicilios`);
        let savedDomicilio;
        try {
            savedDomicilio = await domicilioService.post(sucursal.domicilio);
        } catch (error) {
            console.error('Error saving domicilio:', error);
            return;
        }

        const updatedSucursal = { ...sucursal, domicilio: savedDomicilio };
        
        try {
            if (Number(id) !== 0) {
                await new SucursalService(`${apiUrl}sucursales`).put(Number(id), updatedSucursal);
            } else {
                await new SucursalService(`${apiUrl}sucursales`).post(updatedSucursal);
            }
            alert("Sucursal guardada con exito!");
            navigate(-1);
        } catch (error) {
            console.error('Error saving sucursal:', error);
        }
    };

    return createPortal(
        <article className={`modalPropio ${isOpen && 'is-open'}`} onClick={closeModal}>
            <div className="container" style={{ maxHeight: "649px", minHeight: "649px" }} onClick={handleModalContainer}>
                <div className="modalPropio-close" onClick={closeModal}>
                    <img width={32} height={32} src={cruz_blue} alt="curzAzul" />
                </div>

                <div>
                    <ProgressBar now={(step / 2) * 100} />
                    <form action="" className="formContainer">
                        {step === 1 && (
                            <>
                                <label htmlFor="nombre">Nombre de la sucursal</label>
                                <input type="text" id="nombre" name="nombre" value={sucursal.nombre} onChange={handleSucursalChange} />

                                <label htmlFor="horarioApert">Horario Apertura</label>
                                <input type="text" id="horarioApert" name="horarioApertura" value={sucursal.horarioApertura} onChange={handleSucursalChange} />

                                <label htmlFor="horarioClose">Horario Cierre</label>
                                <input type="text" id="horarioClose" name="horarioCierre" value={sucursal.horarioCierre} onChange={handleSucursalChange} />

                                <label htmlFor="casaMatriz">¿Es casa matriz?</label>
                                <input type="checkbox" id="casaMatriz" name="casaMatriz" checked={sucursal.casaMatriz} onChange={(e) => setSucursal({ ...sucursal, casaMatriz: e.target.checked })} />

                                <Button variant="primary" onClick={nextStep}>Siguiente</Button>
                            </>
                        )}
                        {step === 2 && (
                            <>
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

                                <label htmlFor="calle">Calle</label>
                                <input type="text" id="calle" name="calle" value={sucursal.domicilio.calle} onChange={handleDomicilioChange} />

                                <label htmlFor="numero">Número</label>
                                <input type="number" id="numero" name="numero" value={sucursal.domicilio.numero} onChange={handleDomicilioChange} />

                                <label htmlFor="cp">Código Postal</label>
                                <input type="text" id="cp" name="cp" value={sucursal.domicilio.cp} onChange={handleDomicilioChange} />

                                <label htmlFor="piso">Piso</label>
                                <input type="number" id="piso" name="piso" value={sucursal.domicilio.piso} onChange={handleDomicilioChange} />

                                <label htmlFor="nroDpto">Número de Departamento</label>
                                <input type="number" id="nroDpto" name="nroDpto" value={sucursal.domicilio.nroDpto} onChange={handleDomicilioChange} />

                                <Button variant="secondary" onClick={prevStep}>Anterior</Button>
                                <Button variant="success" onClick={SaveSucursal}>Guardar</Button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </article>,
        document.body
    );
}
