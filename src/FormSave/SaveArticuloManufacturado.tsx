import { useCallback, useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import IArticuloManufacturado from "../Entities/IArticuloManufacturado";
import IArticuloInsumo from "../Entities/IArticuloInsumo";
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import ArticuloManufacturadoService from "../Functions/Services/ArticuloManufacturadoService";
import ArticuloInsumoService from "../Functions/Services/ArticuloInsumoService";
import IArticuloManufacturadoDetalles from "../Entities/IArticuloManufacturadoDetalle";
import ICategoria from "../Entities/ICategoria";
import IUnidadMedida from "../Entities/IUnidadMedida";
import UnidadMedidaService from "../Functions/Services/UnidadMedidaService";
import ImagenArticuloService from "../Functions/Services/ImagenArticuloService";
import ISucursalDto from "../Entities/ISucursalDto";
import SucursalService from "../Functions/Services/SucursalService";

export default function SaveArticulo() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK

    const { id } = useParams();
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [insumos, setInsumos] = useState<IArticuloInsumo[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [categoria, setCategoria] = useState<ICategoria[]>([])
    const [unidadMedida, setUnidadMedida] = useState<IUnidadMedida[]>([]);
    const [sucursalesSeleccionadas, setSucursalesSeleccionadas] = useState<number[]>([]);
    const [sucursales, setSucursales] = useState<{ id: number, nombre: string }[]>([]);
    const [show, setShow] = useState(false);
    const [, setCantidades] = useState<{ [key: number]: number }>({});


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

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

    const [articuloManufacturado, setArticulosManufacturado] = useState<IArticuloManufacturado>(
        {
            id: 0,
            baja: false,
            denominacion: '',
            precioVenta: 0,
            unidadMedida: {
                id: 0,
                denominacion: '',
            },
            imagenes: [],
            categoria: {
                id: 0,
                baja:false,
                denominacion: '',
                subCategorias: [],
                articulos: [],
                esInsumo: false,
                sucursales: [],
                categoriaPadre: { // Inicialización correcta
                    id: 0,
                    baja:false,
                    denominacion: '',
                    subCategorias: [],
                    articulos: [],
                    esInsumo: false,
                    categoriaPadre: null, // O undefined, dependiendo de tu lógica
                    sucursales: []
                }
            },
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
            descripcion: '',
            tiempoEstimadoMinutos: 0,
            preparacion: '',
            articuloManufacturadoDetalles: []
        }
    );

    useEffect(() => {
        if (Number(id) !== 0) {
            getArticuloManufacturado(`${apiUrl}articulosManufacturados`, Number(id));
        }
    }, [id, apiUrl]);  // Solo depende de 'id' y 'apiUrl', no de 'articuloManufacturado'
    
    useEffect(() => {
        if (articuloManufacturado.imagenes.length > 0) {
            const firstImageUrl = articuloManufacturado.imagenes[0].url;
            setSelectedImage(firstImageUrl);
        }
    }, [articuloManufacturado.imagenes]);  // Solo actualiza cuando cambia 'imagenes'
    

    const getArticuloManufacturado = async (baseUrl: string, id: number) => {
        const result = new ArticuloManufacturadoService(baseUrl);
        await result.get(id)
            .then(data => {
                if (data !== null) {
                    setArticulosManufacturado(data);
                    //console.log("DATAA"+ JSON.stringify(data))
                } else {
                    console.log("El artículo manufacturado no se encontró.");
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const buscarInsumoXDenominacion = async () => {
        const result = new  ArticuloInsumoService(`${apiUrl}articulosInsumos/filtrar/2?nombre=`);
        

        const insumosResult = await result.buscarInsumoXDenominacion(inputValue);
        console.log("Valor de inputValue:", inputValue);

        console.log(`DATAA: ${JSON.stringify(insumosResult, null, 2)}`);
        if (insumosResult) {
            setInsumos(insumosResult);
        } else {
            setInsumos([]);
        }

    }
    const obtenerCategorias = useCallback(async () => {
            try {
                const result = new ArticuloManufacturadoService(apiUrl);
                const data = await result.getCategorias();
                setCategoria(data.filter((categoria: ICategoria) => !categoria.esInsumo) || []);
            } catch (error) {
                console.error("Error al obtener categorías:", error);
            }
    },[apiUrl]);

    const getAllUnidad = useCallback(async () => {
            try {
                const result = new UnidadMedidaService(`${apiUrl}unidadesMedidas`);
                const unidadMedidaResult = await result.getAll(); // Llama al método genérico
        
                if (Array.isArray(unidadMedidaResult)) {
                    // Si es un array de unidades de medida
                    setUnidadMedida(unidadMedidaResult);
                } else if (unidadMedidaResult && 'data' in unidadMedidaResult) {
                    // Si es un objeto paginado con una propiedad 'data'
                    setUnidadMedida(unidadMedidaResult.content);
                } else {
                    console.error("Unexpected response format for unidadMedida:", unidadMedidaResult);
                    setUnidadMedida([]); // Fallback a un array vacío en caso de error
                }
            } catch (error) {
                console.error("Error fetching unidad de medida:", error);
                setUnidadMedida([]); // Maneja errores y asegura un estado consistente
            }
    },[apiUrl]);

    const agregarInsumo = (insumo: IArticuloInsumo) => {
        const existeInsumo = articuloManufacturado.articuloManufacturadoDetalles.find((insumoDetalle) => insumoDetalle.articulo.id === insumo.id)
        if (existeInsumo) {
            alert("El insumo ya existe en el arreglo");
        } else {
            // const nuevoDetalle: IArticuloManufacturadoDetalles = {
            //     id: 0,
            //     cantidad: 0,
            //     articulo: insumo
            // };
            setArticulosManufacturado(prevState => ({
                ...prevState,
                articuloManufacturadoDetalles: [...prevState.articuloManufacturadoDetalles, { id: Date.now(), articulo: insumo, cantidad: 1 }]
            }));
        }
    };

    //La funcion funciona correctamente pero a la hora de eliminar el primer elemento afuera del modal la pagina se recarga y se pierde todo el proceso
    //Se debe revisar o preguntar
    const deleteInsumo = async (articuloInsumo: IArticuloInsumo) => {
        let articuloInsumoFilter: IArticuloManufacturadoDetalles[] = [];
        if (articuloManufacturado.articuloManufacturadoDetalles) {
            articuloInsumoFilter = articuloManufacturado.articuloManufacturadoDetalles.filter(detalle => detalle.articulo.id !== articuloInsumo.id);
        }
        setArticulosManufacturado(prevState => ({ ...prevState, articuloManufacturadoDetalles: articuloInsumoFilter }));
    }

    const handleChangeCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoriaSeleccionadaId = parseInt(e.target.value); // Convertir a número
        const categoriaSeleccionada = categoria.find(c => c.id === categoriaSeleccionadaId);
        if (categoriaSeleccionada) {
            setArticulosManufacturado(prevState => ({
                ...prevState, // Mantiene las demás propiedades
                categoria: categoriaSeleccionada // Actualiza solo la categoría
            }));
        }
    }
    const handleChangeUnidadSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const unidadSeleccionadaId = parseInt(e.target.value); // Convertir a número
        const unidadSeleccionada = unidadMedida.find(c => c.id === unidadSeleccionadaId);
        if (unidadSeleccionada) {
            setArticulosManufacturado(prevState => ({
                ...prevState, // Mantiene las demás propiedades
                unidadMedida: unidadSeleccionada // Actualiza solo la categoría
            }));
        }
    }

    const handleSucursalChange = (sucursalId: number) => {
        setSucursalesSeleccionadas(prevState => {
            if (prevState.includes(sucursalId)) {
                return prevState.filter(id => id !== sucursalId); // Desmarcar
            } else {
                return [...prevState, sucursalId]; // Marcar
            }
        });
    };

    const validarFormulario = (): boolean => {
        if (!articuloManufacturado.denominacion.trim()) {
            alert("El nombre del articulo es obligatorio.");
            return false;
        }
    
        if (articuloManufacturado.precioVenta <= 0) {
            alert("El precio de venta debe ser mayor que 0.");
            return false;
        }
    
        if (Number(id) === 0 && sucursalesSeleccionadas.length === 0) {
            alert("Debe seleccionar al menos una sucursal.");
            return false;
        }
    
        return true;
    };

    async function obtenerSucursalPorId(id: number): Promise<ISucursalDto> {
            const sucursalService = new SucursalService(`${apiUrl}sucursales`);
            const sucursal = await sucursalService.get(id);
            return sucursal; // Retorna el objeto completo de la sucursal
        }

    const saveArticulo = async () => {
        if (!validarFormulario()) {
            return; // Detiene el proceso si la validación falla
        }

        console.log("Sucursales seleccionadas al guardar:", sucursalesSeleccionadas);
        if (Number(id) === 0 && sucursalesSeleccionadas.length === 0) {
            alert("Debe seleccionar al menos una sucursal.");
            return;
        }

        // Verificar si hay una nueva imagen diferente
        const currentImageUrl = articuloManufacturado.imagenes.length > 0 ? articuloManufacturado.imagenes[0].url : null;
        const isNewImage = selectedImage && selectedImage !== currentImageUrl;

        // Eliminar imagen anterior solo si hay una nueva diferente
        if (isNewImage && currentImageUrl) {
            const publicIdToDelete = currentImageUrl.split('/')[6].split('.')[0];
            try {
                const resultDelete = new ImagenArticuloService(`${apiUrl}images`);
                await resultDelete.deleteImagen(publicIdToDelete, articuloManufacturado.imagenes[0].id);
                console.log("Imagen anterior eliminada correctamente");
            } catch (error) {
                console.error("Error al eliminar la imagen anterior:", error);
                alert("Error al eliminar la imagen anterior. El artículo no será guardado.");
                return;
            }
        }

        // Subir nueva imagen si está seleccionada y es diferente de la actual
        if (isNewImage) {
            try {
                const blob = await fetch(selectedImage).then((res) => res.blob());
                const file = new File([blob], "imagen.jpg", { type: "image/jpeg" });
                const formData = new FormData();
                formData.append("upload", file);
                const result = new ImagenArticuloService(`${apiUrl}images/uploads`);
                const uploadedImage = await result.postImagen(formData);
                if (uploadedImage && uploadedImage.id) {
                    articuloManufacturado.imagenes = [{
                        id: uploadedImage.id,
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
        } else {
            console.log("La imagen no ha cambiado, no se subirá nuevamente.");
        }

        // Verificar datos del artículo con sucursales asociadas
        console.log("Datos finales del artículo a guardar:", JSON.stringify(articuloManufacturado, null, 2));

        // Guardar el artículo en el backend
        try {
            const articuloService = new ArticuloManufacturadoService(`${apiUrl}articulosManufacturados`);

            if (Number(id) !== 0) {
                console.log("Actualizando artículo existente...");
                await articuloService.put(Number(id), articuloManufacturado);
            } else {
                console.log("Creando nuevo artículo...");
                for (const sucursalId of sucursalesSeleccionadas) {
                    const sucursal = await obtenerSucursalPorId(sucursalId);
                    const articuloConSucursal = {
                        ...articuloManufacturado,
                        sucursal: {
                            ...sucursal,
                            id: sucursalId,
                        },
                    };
                    console.log("Artículo con sucursal antes de guardar:", articuloConSucursal);
                    await articuloService.post(articuloConSucursal);
                }
            }            

            alert("Articulo guardado con éxito!");
            navigate(-1);
        } catch (error) {
            console.error("Error al guardar el artículo:", error);
            alert("Error al guardar el artículo.");
        }
    };

    const getAllSucursales = useCallback(async () => {
            try {
                const result = await fetch(`${apiUrl}sucursales`);
            
                const text = await result.text(); // Obtén el contenido como texto primero            
                const data = JSON.parse(text); // Intenta convertirlo en JSON
                setSucursales(data);
            } catch (error) {
                console.error("Error al obtener las sucursales:", error);
            }
    }, [apiUrl]);

    useEffect(() => {
        obtenerCategorias()
        getAllUnidad()
        getAllSucursales();
    }, ([obtenerCategorias, getAllUnidad,getAllSucursales]))

    useEffect(() => {
        //console.log('useEffect ejecutado para articuloManufacturado:', articuloManufacturado);
        if (articuloManufacturado.imagenes.length > 0) {
            const firstImageUrl = articuloManufacturado.imagenes[0].url;
            setSelectedImage(firstImageUrl);
        }
    }, [articuloManufacturado]); 

    const handleCantidadChange = (id: number, nuevaCantidad: number) => {
        setArticulosManufacturado(prevState => {
            // Clonar el array para asegurarnos de no mutar el estado anterior
            const nuevosDetalles = prevState.articuloManufacturadoDetalles.map(detalle => 
                detalle.id === id ? { ...detalle, cantidad: nuevaCantidad } : detalle
            );
    
            return {
                ...prevState,
                articuloManufacturadoDetalles: nuevosDetalles
            };
        });
    };
    

    // const handleInputChange = (id: number, nuevaCantidad: number) => {
    //     setCantidades(prev => ({
    //         ...prev,
    //         [id]: nuevaCantidad // Solo cambia la cantidad del detalle específico
    //     }));
    // };
    

    // const handleBlur = (id: number) => {
    //     setArticulosManufacturado(prevState => ({
    //         ...prevState,
    //         articuloManufacturadoDetalles: prevState.articuloManufacturadoDetalles.map(detalle =>
    //             detalle.id === id ? { ...detalle, cantidad: cantidades[id] } : detalle
    //         )
    //     }));
    // };
    
    
    useEffect(() => {
        const cantidadesIniciales: { [key: number]: number } = {};
        articuloManufacturado.articuloManufacturadoDetalles.forEach(detalle => {
            cantidadesIniciales[detalle.id] = detalle.cantidad;
        });
        setCantidades(cantidadesIniciales);
    }, [articuloManufacturado.articuloManufacturadoDetalles]);
    
    

    return (
        <div className="container">
            <Link to="/articulos" className="btnVolver">
                <img width={24} height={24} src={arrow_left} alt="arrow_left" />
                <p style={{ margin: "0" }}>Volver</p>
            </Link>
            <form action="" className="formContainer">
                <label htmlFor="denominacion">Nombre del producto</label>
                <input type="text" id="denominacion" name="denominacion" value={articuloManufacturado.denominacion} onChange={(e) => setArticulosManufacturado({ ...articuloManufacturado, denominacion: e.target.value })} />
                <label htmlFor="descripcion">Descripción</label>
                <textarea id="descripcion" name="descripcion" value={articuloManufacturado.descripcion} onChange={(e) => setArticulosManufacturado({ ...articuloManufacturado, descripcion: e.target.value })}></textarea>
                <label htmlFor="precioVenta">Precio de Venta</label>
                <input type="text" id="precioVenta" name="precioVenta" value={Number(articuloManufacturado.precioVenta)} onChange={(e) => setArticulosManufacturado({ ...articuloManufacturado, precioVenta: Number(e.target.value )})} />
                <label htmlFor="tiempoEstimadoMinutos">Tiempo Estimado(minutos)</label>
                <input type="number" id="tiempoEstimadoMinutos" name="tiempoEstimadoMinutos" value={Number(articuloManufacturado.tiempoEstimadoMinutos)} onChange={(e) => setArticulosManufacturado({ ...articuloManufacturado, tiempoEstimadoMinutos: Number(e.target.value) })} />
                <input type="file" onChange={onFileChange} />
                {selectedImage && (
                    <div>
                        <h3>Vista previa de la imagen seleccionada:</h3>
                        <img src={selectedImage} alt="Vista previa" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
                    </div>
                )}
                <div style={{ display: "flex", justifyContent: "start",gap:"3rem",margin:"1rem 0" }}>
                    <div>
                        <label htmlFor="categoria" style={{marginRight:"1rem"}}>Categorias</label>
                        <select name="categoria" value={articuloManufacturado.categoria.id} onChange={handleChangeCategorySelect}>
                            {
                                categoria.map((categoria: ICategoria) => {
                                    return (
                                        <option key={categoria.id} value={categoria.id}>{categoria.denominacion}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div>

                        <label htmlFor="unidades" style={{marginRight:"1rem"}}>Unidades</label>
                        <select name="unidades" value={articuloManufacturado.unidadMedida.id} onChange={handleChangeUnidadSelect}>
                            {
                                unidadMedida.map((unidad: IUnidadMedida) => {
                                    return (
                                        <option key={unidad.id} value={unidad.id}>{unidad.denominacion}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                <label htmlFor="preparacion">Preparación</label>
                <textarea id="preparacion" name="preparacion" defaultValue={articuloManufacturado.preparacion} onChange={(e) => setArticulosManufacturado({ ...articuloManufacturado, preparacion: e.target.value })}></textarea>
                <div style={{ display: "flex", justifyContent: "space-between", margin:"1rem 0" }}>
                    <label htmlFor="ingrediente">Ingredientes</label>
                    <Button variant="primary" onClick={handleShow}>
                        Añadir Ingrediente
                    </Button>
                </div>
                <div>
                    {/* Título dinámico */}
                    <label>
                        {Number(id) === 0 
                            ? "Sucursales" 
                            : `Sucursal: ${
                                sucursales.find(sucursal => sucursal.id === articuloManufacturado.sucursal.id)?.nombre || 'N/A'
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

                {articuloManufacturado.articuloManufacturadoDetalles && articuloManufacturado.articuloManufacturadoDetalles.length > 0 && (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th>Denominación</th>
                            <th>Cantidad</th>
                            <th>Unidad de medida</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articuloManufacturado.articuloManufacturadoDetalles.map((detalle) => {
                            // Asegúrate de que 'articuloInsumo' tiene datos
                            const articuloInsumo = detalle.articulo;
                
                            return (
                                <tr key={detalle.id}>
                                    <td>
                                        <p>{articuloInsumo ? articuloInsumo.denominacion : 'N/A'}</p>
                                    </td>
                                    <td>
                                        <input 
                                            type='number' 
                                            value={detalle.cantidad} 
                                            onChange={e => handleCantidadChange(detalle.id, Number(e.target.value))} 
                                        />

                                    </td>
                                    <td>
                                        <p>{articuloInsumo ? articuloInsumo.unidadMedida.denominacion : 'N/A'}</p>
                                    </td>
                                    <td>
                                        <button style={{ marginBottom: 10 }} className="btn btn-danger" onClick={() => deleteInsumo(articuloInsumo)}>Eliminar</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                
                                
                )}
            </form>

            <button className="btn btn-primary" onClick={saveArticulo}>Guardar</button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ingredientes</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="d-flex justify-content-between">
                        <input className="ms-1" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                        <Button variant="primary" onClick={buscarInsumoXDenominacion}>Mostrar ingredientes</Button>
                    </div>
                        <ul className="listaAgregarInsumo">
                            {
                                insumos.map((insumo, index) => (
                                    <li key={index} onClick={() => agregarInsumo(insumo)}>{insumo.denominacion}</li>
                                ))
                            }
                        </ul>
                    <div>
                        <h3>Ingredientes seleccionados:</h3>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}