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
import CategoriaService from "../Functions/Services/CategoriaService";
import SucursalService from "../Functions/Services/SucursalService";
import ISucursalDto from "../Entities/ISucursalDto";

export default function SaveInsumo() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK

    const { id } = useParams();
    const navigate = useNavigate();
    const [categoria, setCategoria] = useState<ICategoria[]>([])
    const [unidadMedida, setUnidadMedida] = useState<IUnidadMedida[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [sucursales, setSucursales] = useState<{ id: number, nombre: string }[]>([]);
    const [sucursalesSeleccionadas, setSucursalesSeleccionadas] = useState<number[]>([]);

    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    const [articuloInsumo, setArticulosInsumo] = useState<IArticuloInsumo>({
        id: Number(id),
        denominacion: '',
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
        precioVenta: 0,
        unidadMedida: {
            id: 0,
            denominacion: '',
        },
        imagenes: [],
        categoria: {
            id: 0,
            denominacion: '',
            subCategorias: [],
            articulos: [],
        },
        precioCompra: 0,
        stockActual: 0,
        stockMaximo: 0,
        stockMinimo:0,
        esParaElaborar: true,
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
        if (articuloInsumo.imagenes.length > 0) {
            const firstImageUrl = articuloInsumo.imagenes[0].url;
            setSelectedImage(firstImageUrl); // Establece la imagen inicial desde los datos
        }
    }, [articuloInsumo.imagenes]);

    
    

    const getArticuloInsumo = async (baseUrl: string, id: number) => {
        const result = new ArticuloInsumoService(baseUrl);
        await result.getById(id)
            .then((data: IArticuloInsumo | null) => {
                if (data !== null) {
                    setArticulosInsumo(data);
                    //console.log("ARTICULO TRAIDO: ", JSON.stringify(data, null, 2)); // Aquí se imprime el artículo
                } else {
                    console.log("El insumo no se encontró.");
                }
            })
            .catch(error => {
                console.log("Error al obtener el artículo: ", error);
            });
    };


    const getAllCategories = async () => {
        const result = new CategoriaService(`${apiUrl}categorias`);
        const categoriaResult = await result.getAllCategorias(); // Llama al método del servicio
    
        if (Array.isArray(categoriaResult)) {
            // Resultado no paginado: un array de categorías
            setCategoria(categoriaResult);
        } else if (categoriaResult && 'data' in categoriaResult) {
            // Resultado paginado: objeto con la propiedad 'data'
            setCategoria(categoriaResult.content); // Usa la propiedad 'data' para extraer las categorías
        } else {
            console.error("Unexpected response format for categories:", categoriaResult);
            setCategoria([]); // Fallback a un array vacío en caso de error
        }
    };
    
    const getAllUnidad = async () => {
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
    };

    async function obtenerSucursalPorId(id: number): Promise<ISucursalDto> {
        const sucursalService = new SucursalService(`${apiUrl}sucursales`);
        const sucursal = await sucursalService.get(id);
        return sucursal; // Retorna el objeto completo de la sucursal
    }
    
    const handleChangeCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoriaSeleccionadaId = parseInt(e.target.value); // Convertir a número
        const categoriaSeleccionada = categoria.find(c => c.id === categoriaSeleccionadaId);
        if (categoriaSeleccionada) {
            setArticulosInsumo(prevState => ({
                ...prevState,
                categoria: categoriaSeleccionada // Asegúrate de asignar el objeto completo
            }));
        }
    };
   
    const handleChangeUnidadSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const unidadSeleccionadaId = parseInt(e.target.value); // Convertir a número
        const unidadSeleccionada = unidadMedida.find(c => c.id === unidadSeleccionadaId);
        if (unidadSeleccionada) {
            setArticulosInsumo(prevState => ({
                ...prevState,
                unidadMedida: unidadSeleccionada // Asegúrate de asignar el objeto completo
            }));
        }
    };

    const getAllSucursales = async () => {
        try {
            const result = await fetch(`${apiUrl}sucursales`);
            const data = await result.json();
            setSucursales(data);
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
        }
    };

    const saveArticulo = async () => {

        if (!validarFormulario()) {
            return; // Detiene el proceso si la validación falla
        }
        
        console.log("Sucursales seleccionadas al guardar:", sucursalesSeleccionadas);  // Log para ver las sucursales seleccionadas al guardar
        if (Number(id) === 0 && sucursalesSeleccionadas.length === 0) {
            alert("Debe seleccionar al menos una sucursal.");
            return;
        }
    
        // Eliminar imagen anterior si existe
        if (articuloInsumo.imagenes.length > 0) {
            const imageUrl = articuloInsumo.imagenes[0].url;
            const publicIdToDelete = imageUrl.split('/')[6].split('.')[0];
            try {
                const resultDelete = new ImagenArticuloService(`${apiUrl}images`);
                await resultDelete.deleteImagen(publicIdToDelete, articuloInsumo.imagenes[0].id);
                console.log("Imagen anterior eliminada correctamente");
            } catch (error) {
                console.error("Error al eliminar la imagen anterior:", error);
                alert("Error al eliminar la imagen anterior. El artículo no será guardado.");
                return;
            }
        }
    
        // Subir nueva imagen si está seleccionada
        if (selectedImage) {
            try {
                const blob = await fetch(selectedImage).then((res) => res.blob());
                const file = new File([blob], "imagen.jpg", { type: "image/jpeg" });
                const formData = new FormData();
                formData.append("upload", file);
                const result = new ImagenArticuloService(`${apiUrl}images/uploads`);
                const uploadedImage = await result.postImagen(formData);
                if (uploadedImage && uploadedImage.id) {
                    articuloInsumo.imagenes = [{
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
        }
    
        // Verificar datos del artículo con sucursales asociadas
        console.log("Datos finales del artículo a guardar:", JSON.stringify(articuloInsumo, null, 2));
    
        // Guardar el artículo en el backend
        try {
            const articuloService = new ArticuloInsumoService(`${apiUrl}articulosInsumos`);

            if (Number(id) !== 0) {
                console.log("Actualizando artículo existente...");
                await articuloService.put(Number(id), articuloInsumo);
            } else {
                console.log("Creando nuevo artículo...");
                for (const sucursalId of sucursalesSeleccionadas) {
                    const sucursal = await obtenerSucursalPorId(sucursalId);
                    const articuloConSucursal = {
                        ...articuloInsumo,
                        sucursal: {
                            ...sucursal,
                            id: sucursalId,
                        },
                    };
                    console.log("Artículo con sucursal antes de guardar:", articuloConSucursal);
                    await articuloService.post(articuloConSucursal);
                }
            }            

            alert("Insumo guardado con éxito!");
            navigate(-1);
        } catch (error) {
            console.error("Error al guardar el artículo:", error);
            alert("Error al guardar el artículo.");
        }
    };
    
  
    // const handleFileChange = (e)=>{
    //     const selectedFile = e.target.files[0];
    //     const imageUrl = selectedFile.name; // Suponiendo que aquí guardas la URL de la imagen

    //     setImgUrl({
    //     id: Number(id) !== 0 ? articuloManufacturado.imagenes[0].id : 0,
    //     url: imageUrl
    //     });
    // }
    const handleRadioChange = (e: { target: { value: string; }; }) => {
        const esParaElaborar = e.target.value === 'true';
        setArticulosInsumo({ 
            ...articuloInsumo, 
            esParaElaborar,
            precioVenta: esParaElaborar ? 0 : articuloInsumo.precioVenta // Si esParaElaborar es true, precioVenta será 0
        });
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
            getArticuloInsumo(`${apiUrl}articulosInsumos`, Number(id)).then(() => {
                if (articuloInsumo.sucursal && articuloInsumo.sucursal.id) {
                    setSucursalesSeleccionadas([articuloInsumo.sucursal.id]); // Marcar la sucursal asociada
                }
            });
        }
        getAllCategories();
        getAllUnidad();
        getAllSucursales();
    }, [id]);

    const validarFormulario = (): boolean => {
        if (!articuloInsumo.denominacion.trim()) {
            alert("El nombre del insumo es obligatorio.");
            return false;
        }
    
        if (articuloInsumo.precioCompra <= 0) {
            alert("El precio de compra debe ser mayor que 0.");
            return false;
        }
    
        if (articuloInsumo.stockMinimo < 0 || articuloInsumo.stockMaximo < 0) {
            alert("El stock mínimo y máximo no pueden ser negativos.");
            return false;
        }
    
        if (articuloInsumo.stockMinimo >= articuloInsumo.stockMaximo) {
            alert("El stock mínimo debe ser menor que el stock máximo.");
            return false;
        }
    
        if (articuloInsumo.esParaElaborar === false && articuloInsumo.precioVenta <= 0) {
            alert("El precio de venta debe ser mayor que 0 para insumos que no son para elaborar.");
            return false;
        }
    
        if (Number(id) === 0 && sucursalesSeleccionadas.length === 0) {
            alert("Debe seleccionar al menos una sucursal.");
            return false;
        }
    
        return true;
    };
    

    return (
        <div className="container">
            <Link to="/insumos" className="btnVolver">
                <img width={24} height={24} src={arrow_left} alt="arrow_left" />
                <p style={{ margin: "0" }}>Volver</p>
            </Link>
            <form action="" className="formContainer">
                <label htmlFor="denominacion">Nombre del insumo</label>
                <input type="text" id="denominacion" name="denominacion" value={articuloInsumo.denominacion} onChange={(e) => setArticulosInsumo({ ...articuloInsumo, denominacion: e.target.value })} />
                <label htmlFor="precioCompra">Precio de compra </label>
                <input type="number" id="precioCompra" name="precioCompra" value={articuloInsumo.precioCompra} onChange={(e) => setArticulosInsumo({ ...articuloInsumo, precioCompra: Number(e.target.value) })}></input>
                <label htmlFor="stockActual">Stock actual</label>
                <input type="number" id="stockActual" name="stockActual" value={Number(articuloInsumo.stockActual)} onChange={(e) => setArticulosInsumo({ ...articuloInsumo, stockActual: Number(e.target.value) })} />
                <label htmlFor="stockMaximo">Stock maximo</label>
                <input type="number" id="stockMaximo" name="stockMaximo" value={Number(articuloInsumo.stockMaximo)} onChange={(e) => setArticulosInsumo({ ...articuloInsumo, stockMaximo: Number(e.target.value) })} />
                <label htmlFor="stockMinimo">Stock minimo</label>
                <input type="number" id="stockMinimo" name="stockMinimo" value={Number(articuloInsumo.stockMinimo)} onChange={(e) => setArticulosInsumo({ ...articuloInsumo, stockMinimo: Number(e.target.value) })} />
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
                        <select name="categoria" value={articuloInsumo.categoria.id} onChange={handleChangeCategorySelect}>
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
                        <select name="unidades" value={articuloInsumo.unidadMedida.id} onChange={handleChangeUnidadSelect}>
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
                <label htmlFor="esParaElaborar">Es un insumo para Elaborar? </label>
                <label>
                    <input
                    type="radio"
                    id="esParaElaborarSi"
                    name="esParaElaborar"
                    value="true"
                    checked={articuloInsumo.esParaElaborar === true}
                    onChange={handleRadioChange}
                    />
                    Sí
                </label>
                <label>
                    <input
                    type="radio"
                    id="esParaElaborarNo"
                    name="esParaElaborar"
                    value="false"
                    checked={articuloInsumo.esParaElaborar === false}
                    onChange={handleRadioChange}
                    />
                    No
                </label>

                {articuloInsumo.esParaElaborar === false && (
                    <>
                        <label htmlFor="precioVenta">Precio de Venta</label>
                        <input 
                            type="number" 
                            id="precioVenta" 
                            name="precioVenta" 
                            value={articuloInsumo.precioVenta} 
                            onChange={(e) => setArticulosInsumo({ ...articuloInsumo, precioVenta: Number(e.target.value) })} 
                        />
                    </>
                )}
                <br />
                <div>
                    {/* Título dinámico */}
                    <label>
                        {Number(id) === 0 
                            ? "Sucursales" 
                            : `Sucursal: ${
                                sucursales.find(sucursal => sucursal.id === articuloInsumo.sucursal.id)?.nombre || 'N/A'
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

            <button className="btn btn-primary" onClick={saveArticulo}>Guardar</button>
        </div>
    )
}