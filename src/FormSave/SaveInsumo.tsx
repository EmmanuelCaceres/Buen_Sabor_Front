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

export default function SaveInsumo() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK

    const { id } = useParams();
    const navigate = useNavigate();
    const [categoria, setCategoria] = useState<ICategoria[]>([])
    const [unidadMedida, setUnidadMedida] = useState<IUnidadMedida[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    const [articuloInsumo, setArticulosInsumo] = useState<IArticuloInsumo>({
        id: Number(id),
        denominacion: '',
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
            articulos: []
        },
        precioCompra: 0,
        stockActual: 0,
        stockMaximo: 0,
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
    
    


    const handleChangeCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoriaSeleccionadaId = parseInt(e.target.value); // Convertir a número
        const categoriaSeleccionada = categoria.find(c => c.id === categoriaSeleccionadaId);
        if (categoriaSeleccionada) {
            setArticulosInsumo(prevState => ({
                ...prevState, // Mantiene las demás propiedades
                categoria: categoriaSeleccionada // Actualiza solo la categoría
            }));
        }
    }


    const handleChangeUnidadSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const unidadSeleccionadaId = parseInt(e.target.value); // Convertir a número
        const unidadSeleccionada = unidadMedida.find(c => c.id === unidadSeleccionadaId);
        if (unidadSeleccionada) {
            setArticulosInsumo(prevState => ({
                ...prevState, // Mantiene las demás propiedades
                unidadMedida: unidadSeleccionada // Actualiza solo la unidad de medida
            }));
        }
    }

    

    const saveArticulo = async () => {
        // Primero, si ya hay una imagen anterior, la eliminamos
        if (articuloInsumo.imagenes.length > 0) {
            const imageUrl = articuloInsumo.imagenes[0].url;  // URL de la imagen anterior
            const publicIdToDelete = imageUrl.split('/')[6].split('.')[0];  // Extraer el publicId de la URL
        
            // Llamamos al endpoint para eliminar la imagen anterior
            try {
                const resultDelete = new ImagenArticuloService(`${apiUrl}images`);
                await resultDelete.deleteImagen(publicIdToDelete, articuloInsumo.imagenes[0].id);
                console.log("Imagen anterior eliminada correctamente");
            } catch (error) {
                console.log("Error al eliminar la imagen anterior:", error);
                alert("Error al eliminar la imagen anterior. El artículo no será guardado.");
                return; // Si ocurre un error al eliminar, no seguimos con la carga del artículo.
            }
        }
    
        console.log("Imagen seleccionada:", selectedImage);
        // Luego, subimos la nueva imagen si fue seleccionada
        if (selectedImage) {
            // Convertir el Blob a File
            const blob = await fetch(selectedImage).then(res => res.blob());  // Convertimos la URL de la imagen a un Blob
            const file = new File([blob], 'imagen.jpg', { type: 'image/jpeg' }); // Convertimos el Blob a File
    
            const formData = new FormData();
            formData.append("upload", file);  // Aquí aseguramos que el parámetro se llama 'upload'
        
            // Verifica el contenido del FormData (solo en desarrollo, no en producción)
            console.log(formData);
        
            // Subimos la nueva imagen
            try {
                const result = new ImagenArticuloService(`${apiUrl}images/uploads`);
                const uploadedImage = await result.postImagen(formData);
        
                if (uploadedImage) {
                    setArticulosInsumo(prevState => ({
                        ...prevState,
                        imagenes: [{
                            id: uploadedImage.id,
                            url: uploadedImage.url
                        }]
                    }));
                    console.log("Imagen subida correctamente:", uploadedImage);
                } else {
                    console.log("No data received from the image upload");
                }
            } catch (error) {
                console.log("Error al subir la imagen:", error);
                alert("Error al subir la nueva imagen. El artículo no será guardado.");
                return;
            }
        }
    
        // Ahora que la imagen ha sido eliminada (si era necesario) y la nueva imagen cargada, guardamos el artículo
        try {
            if (Number(id) !== 0) {
                // Actualizar artículo existente
                await new ArticuloInsumoService(`${apiUrl}articulosInsumos`).put(Number(id), articuloInsumo);
            } else {
                // Crear nuevo artículo
                await new ArticuloInsumoService(`${apiUrl}articulosInsumos`).post(articuloInsumo);
            }
            alert("Insumo guardado con éxito!");
            navigate(-1); // Volver a la página anterior
        } catch (error) {
            console.log("Error al guardar el artículo:", error);
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


    useEffect(() => {
        getAllCategories();
        getAllUnidad();
        if (Number(id) !== 0) {
            getArticuloInsumo(`${apiUrl}articulosInsumos`, Number(id));
        }
    }, [id]);

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
                <input type="text" id="stockActual" name="stockActual" value={Number(articuloInsumo.stockActual)} onChange={(e) => setArticulosInsumo({ ...articuloInsumo, stockActual: Number(e.target.value) })} />
                <label htmlFor="stockMaximo">Stock maximo</label>
                <input type="number" id="stockMaximo" name="stockMaximo" value={Number(articuloInsumo.stockMaximo)} onChange={(e) => setArticulosInsumo({ ...articuloInsumo, stockMaximo: Number(e.target.value) })} />
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
            </form>

            <button className="btn btn-primary" onClick={saveArticulo}>Guardar</button>
        </div>
    )
}
