import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import IArticuloInsumo from "../Entities/IArticuloInsumo";
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import ArticuloInsumoService from "../Functions/Services/ArticuloInsumoService";
import ICategoria from "../Entities/ICategoria";
import IUnidadMedida from "../Entities/IUnidadMedida";
import UnidadMedidaService from "../Functions/Services/UnidadMedidaService";
import ImagenArticuloService from "../Functions/Services/ImagenArticuloService";
//import CategoriaService from "../Functions/Services/CategoriaService";
import SucursalService from "../Functions/Services/SucursalService";
import ISucursalDto from "../Entities/ISucursalDto";
import IEmpleado from "../Entities/IEmpleado";
import EmpleadoService from "../Functions/Services/EmpleadoService";
import ImagenPersonaService from "../Functions/Services/ImagenPersonaService";
import IRol from "../Entities/IRol";

export default function SaveEmpleado() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK

    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [sucursales, setSucursales] = useState<{ id: number, nombre: string }[]>([]);
    const [sucursalesSeleccionadas, setSucursalesSeleccionadas] = useState<number[]>([]);

    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    const [empleado, setEmpleado] = useState<IEmpleado>({
        id: Number(id),
        baja:false,
        nombre: '',
        apellido: '',
        telefono: '',
        fechaNac: new Date(),
        sucursal: {
            id: 0,
            nombre: '',
            horarioApertura: '',
            horarioCierre: '',
            baja: false,
            casaMatriz: false,
            domicilio:{
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
                            id: 0,
                            baja: false,
                            nombre: '',
                        },
                    },
                },
            },
            empresa: {
                id: 0,
                baja: false,
                nombre: '',
                razonSocial: '',
                cuil: '',
            },
        },
        imagen: {
            id: 0,
            baja: false,
            url: '',
            name: '',
        },
        usuario: {
            id: 0,
            baja: false,
            auth0Id: '',
            username: '',
            email: '',
            rol: IRol.CLIENTE,
        }
    });
    
    
    

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
    
        if (!file) {
            console.log("No file selected");
            return;
        }
    
        // Mostrar la nueva imagen en una etiqueta img
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);  // Establece la imagen seleccionada
        console.log("File uploaded: ", imageUrl);
    };
    

    useEffect(() => {
            const ImageUrl = empleado.imagen.url;
            setSelectedImage(ImageUrl); // Establece la imagen inicial desde los datos
    }, [empleado.imagen]);

    
    

    const getEmpleado = async (baseUrl: string, id: number) => {
        const result = new EmpleadoService(baseUrl);
        await result.getById(id)
            .then((data: IEmpleado | null) => {
                if (data !== null) {
                    setEmpleado(data);
                    //console.log("Empleado TRAIDO: ", JSON.stringify(data, null, 2)); // Aquí se imprime el empleado
                } else {
                    console.log("El empleado no se encontró.");
                }
            })
            .catch(error => {
                console.log("Error al obtener el empleado: ", error);
            });
    };
    


    async function obtenerSucursalPorId(id: number): Promise<ISucursalDto> {
        const sucursalService = new SucursalService(`${apiUrl}sucursales`);
        const sucursal = await sucursalService.get(id);
        return sucursal; // Retorna el objeto completo de la sucursal
    }

    const getAllSucursales = async () => {
        try {
            const result = await fetch(`${apiUrl}sucursales`);
            const data = await result.json();
            setSucursales(data);
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
        }
    };

    const saveEmpleado = async () => {

        if (!validarFormulario()) {
            return; // Detiene el proceso si la validación falla
        }
        
        console.log("Sucursales seleccionadas al guardar:", sucursalesSeleccionadas);  // Log para ver las sucursales seleccionadas al guardar
        if (Number(id) === 0 && sucursalesSeleccionadas.length === 0) {
            alert("Debe seleccionar al menos una sucursal.");
            return;
        }
    
        // Subir nueva imagen si está seleccionada
        if (selectedImage) {
            try {
                const blob = await fetch(selectedImage).then((res) => res.blob());
                const file = new File([blob], "imagen.jpg", { type: "image/jpeg" });
                const formData = new FormData();
                formData.append("upload", file);
                const result = new ImagenPersonaService(`${apiUrl}imagenesPersona/uploads`);
                const uploadedImage = await result.postImagen(formData);
                if (uploadedImage && uploadedImage.id) {
                    empleado.imagen = [{
                        id: uploadedImage.id,
                        baja: uploadedImage.baja,
                        name: uploadedImage.name,
                        url: uploadedImage.url,
                    }];
                    console.log("Imagen subida correctamente:", uploadedImage);
                } else {
                    console.error("Error en la subida de imagen: No se recibió ID válido.");
                    return;
                }
            } catch (error) {
                console.error("Error al subir la imagen:", error);
                alert("Error al subir la nueva imagen. El artículo no será guardado.");
                return;
            }
        }
    
        // Verificar datos del artículo con sucursales asociadas
        console.log("Datos finales del empleado a guardar:", JSON.stringify(empleado, null, 2));
    
        // Guardar el artículo en el backend
        try {
            const empleadoService = new EmpleadoService(`${apiUrl}articulosInsumos`);

            if (Number(id) !== 0) {
                console.log("Actualizando artículo existente...");
                await EmpleadoService.put(Number(id), empleado);
            } else {
                console.log("Creando nuevo empleado...");
                for (const sucursalId of sucursalesSeleccionadas) {
                    const sucursal = await obtenerSucursalPorId(sucursalId);
                    const empleadoConSucursal = {
                        ...empleado,
                        sucursal: {
                            ...sucursal,
                            id: sucursalId,
                        },
                    };
                    console.log("Artículo con sucursal antes de guardar:", empleadoConSucursal);
                    await EmpleadoService.post(empleadoConSucursal);
                }
            }            

            alert("empleado guardado con éxito!");
            navigate(-1);
        } catch (error) {
            console.error("Error al guardar el empleado:", error);
            alert("Error al guardar el empleado.");
        }
    };

    const handleChangeRol = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEmpleado((prevEmpleado) => ({
            ...prevEmpleado,
            usuario: {
                ...prevEmpleado.usuario,
                rol: event.target.value as IRol, // Aseguramos que el valor sea del tipo IRol
            },
        }));
    };
    
    

    const handleSucursalChange = (sucursalId: number) => {
        setSucursalesSeleccionadas(prevState => {
            if (prevState.includes(sucursalId)) {
                return prevState.filter(id => id !== sucursalId); // Desmarcar
            } else {
                return [...prevState, sucursalId]; // Marcar
            }
        });
    };


    useEffect(() => {
        if (Number(id) !== 0) {
            getEmpleado(`${apiUrl}empleados`, Number(id)).then(() => {
                if (empleado.sucursal && empleado.sucursal.id) {
                    setSucursalesSeleccionadas([empleado.sucursal.id]); // Marcar la sucursal asociada
                }
            });
        }
        getAllSucursales();
    }, [id]);

    const validarFormulario = (): boolean => {
        // if (!articuloInsumo.denominacion.trim()) {
        //     alert("El nombre del insumo es obligatorio.");
        //     return false;
        // }
    
        // if (articuloInsumo.precioCompra <= 0) {
        //     alert("El precio de compra debe ser mayor que 0.");
        //     return false;
        // }
    
        // if (articuloInsumo.stockMinimo < 0 || articuloInsumo.stockMaximo < 0) {
        //     alert("El stock mínimo y máximo no pueden ser negativos.");
        //     return false;
        // }
    
        // if (articuloInsumo.stockMinimo >= articuloInsumo.stockMaximo) {
        //     alert("El stock mínimo debe ser menor que el stock máximo.");
        //     return false;
        // }
    
        // if (articuloInsumo.esParaElaborar === false && articuloInsumo.precioVenta <= 0) {
        //     alert("El precio de venta debe ser mayor que 0 para insumos que no son para elaborar.");
        //     return false;
        // }
    
        // if (Number(id) === 0 && sucursalesSeleccionadas.length === 0) {
        //     alert("Debe seleccionar al menos una sucursal.");
        //     return false;
        // }
    
        return true;
    };
    

    return (
        <div className="container">
            <Link to="/panel-usuario/insumos" className="btnVolver">
                <img width={24} height={24} src={arrow_left} alt="arrow_left" />
                <p style={{ margin: "0" }}>Volver</p>
            </Link>
            <form action="" className="formContainer">
                <label htmlFor="apellido">Apellido</label>
                <input type="text" id="apellido" name="apellido" value={empleado.apellido} onChange={(e) => setEmpleado({ ...empleado, apellido: e.target.value })} />
                <label htmlFor="nombre">Nombres </label>
                <input type="number" id="nombre" name="nombre" value={empleado.nombre} onChange={(e) => setEmpleado({ ...empleado, nombre: e.target.value })}></input>
                <label htmlFor="Email">Email</label>
                <input type="number" id="Email" name="Email" value={empleado.usuario.email} onChange={(e) => setEmpleado({ ...empleado, usuario.email: e.target.value })} />
                <label htmlFor="telefono">Telefono</label>
                <input type="number" id="telefono" name="telefono" value={Number(empleado.telefono)} onChange={(e) => setEmpleado({ ...empleado, telefono: e.target.value })} />
                <label htmlFor="Username">Username</label>
                <input type="number" id="Username" name="Username" value={Number(empleado.usuario.username)} onChange={(e) => setEmpleado({ ...empleado, usuario.username : e.target.value })} />
                <input type="file" onChange={onFileChange} />
                {selectedImage && (
                    <div>
                        <h3>Vista previa de la imagen seleccionada:</h3>
                        <img src={selectedImage} alt="Vista previa" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
                    </div>
                )}
                <div style={{ display: "flex", justifyContent: "start",gap:"3rem",margin:"1rem 0" }}>
                    <div>
                        <label htmlFor="rol" style={{marginRight:"1rem"}}>Rol</label>
                        <select name="rol" value={empleado.usuario.rol} onChange={handleChangeRol}>
                            {Object.values(IRol).map((rol) => (
                                <option key={rol} value={rol}>{rol}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <br />
                <div>
                    {/* Título dinámico */}
                    <label>
                        {Number(id) === 0 
                            ? "Sucursales" 
                            : `Sucursal: ${
                                sucursales.find(sucursal => sucursal.id === empleado.sucursal.id)?.nombre || 'N/A'
                            }`
                        }
                    </label>
                    <div>
                        {/* Mostrar checkboxes solo si id === 0 */}
                        {Number(id) === 0 && sucursales.map(sucursal => (
                            <label key={sucursal.id}>
                                <input 
                                    type="checkbox" 
                                    value={sucursal.id}
                                    checked={sucursalesSeleccionadas.includes(sucursal.id)} 
                                    onChange={() => handleSucursalChange(sucursal.id)}
                                />
                                {sucursal.nombre}
                            </label>
                        ))}
                    </div>
                </div>

            </form>

            <button className="btn btn-primary" onClick={saveEmpleado}>Guardar</button>
        </div>
    )
}