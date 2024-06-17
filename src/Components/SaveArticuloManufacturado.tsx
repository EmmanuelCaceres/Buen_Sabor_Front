import { useEffect, useState } from "react";
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
import IImagenArticulo from "../Entities/IImagenArticulo";
import ICategoria from "../Entities/ICategoria";
import CatetgoriaService from "../Functions/Services/CategoriaService";
import IUnidadMedida from "../Entities/IUnidadMedida";
import UnidadMedidaService from "../Functions/Services/UnidadMedidaService";
import ImagenArticuloService from "../Functions/Services/ImagenArticuloService";

export default function SaveArticulo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [insumos, setInsumos] = useState<IArticuloInsumo[]>([]);
    const [imgUrl, setImgUrl] = useState<IImagenArticulo>(
        {
            id: 0,
            url: ''
        }
    );
    const [categoria, setCategoria] = useState<ICategoria[]>([])
    const [unidadMedida, setUnidadMedida] = useState<IUnidadMedida[]>([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();
        const file = event.target.files?.[0];
    
        if (!file) {
            console.log("No file selected");
            return;
        }
    
        formData.append("file", file);
        console.log(formData);
    
        const result = new ImagenArticuloService("http://localhost:8080/imagenArticulos");
        result.postImagen(formData)
            .then(data => {
                if (data) {
                    //console.log(data);
                    setArticulosManufacturado(prevState => ({
                        ...prevState,
                        imagenes: [
                            ...prevState.imagenes,
                            {
                                id: data.id,
                                url: data.url
                            }
                        ]
                    }));
                } else {
                    console.log("No data received");
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const [articuloManufacturado, setArticulosManufacturado] = useState<IArticuloManufacturado>(
        {
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
                sucursales: [],
                subCategorias: [],
                articulos: []
            },
            descripcion: '',
            tiempoEstimadoMinutos: 0,
            preparacion: '',
            articuloManufacturadoDetalles: []
        }
    );

    const getArticuloManufacturado = async (baseUrl: string, id: number) => {
        const result = new ArticuloManufacturadoService(baseUrl);
        await result.getById(id)
            .then(data => {
                if (data !== null) {
                    setArticulosManufacturado(data);
                    console.log("DATAA"+ JSON.stringify(data))
                } else {
                    console.log("El artículo manufacturado no se encontró.");
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const buscarInsumoXDenominacion = async () => {
        const result = new ArticuloInsumoService("http://localhost:8080/articuloInsumos/search?denominacion=");
        const insumosResult = await result.getInsumoByDenominacion(inputValue);
        if (insumosResult) {
            setInsumos(insumosResult);
        } else {
            setInsumos([]);
        }

    }
    const getAllCategories = async () => {
        const result = new CatetgoriaService("http://localhost:8080/categorias")
        const categoriaResult = await result.getAll();
        setCategoria(categoriaResult);
    }

    const getAllUnidad = async () => {
        const result = new UnidadMedidaService("http://localhost:8080/unidadMedidas")
        const unidadMedidaResult = await result.getAll();
        setUnidadMedida(unidadMedidaResult)
    }

    const agregarInsumo = (insumo: IArticuloInsumo) => {
        const existeInsumo = articuloManufacturado.articuloManufacturadoDetalles.find((insumoDetalle) => insumoDetalle.articuloInsumo.id === insumo.id)
        if (existeInsumo) {
            alert("El insumo ya existe en el arreglo");
        } else {
            const nuevoDetalle: IArticuloManufacturadoDetalles = {
                id: 0,
                cantidad: 0,
                articuloInsumo: insumo
            };
            setArticulosManufacturado(prevState => ({
                ...prevState,
                articuloManufacturadoDetalles: [...prevState.articuloManufacturadoDetalles, nuevoDetalle]
            }));
        }
    };

    //La funcion funciona correctamente pero a la hora de eliminar el primer elemento afuera del modal la pagina se recarga y se pierde todo el proceso
    //Se debe revisar o preguntar
    const deleteInsumo = async (articuloInsumo: IArticuloInsumo) => {
        let articuloInsumoFilter: IArticuloManufacturadoDetalles[] = [];
        if (articuloManufacturado.articuloManufacturadoDetalles) {
            articuloInsumoFilter = articuloManufacturado.articuloManufacturadoDetalles.filter(detalle => detalle.articuloInsumo.id !== articuloInsumo.id);
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

    const saveArticulo = async () => {
        //console.log(articuloManufacturado);
        if (Number(id) !== 0) {
            await new ArticuloManufacturadoService("http://localhost:8080/articuloManufacturados").put(Number(id), articuloManufacturado);
        } else {
            await new ArticuloManufacturadoService("http://localhost:8080/articuloManufacturados").post(articuloManufacturado);
        }
        alert("Articulo guardado con exito!");
        handleClose();
        navigate(-1);
    };
    // const handleFileChange = (e)=>{
    //     const selectedFile = e.target.files[0];
    //     const imageUrl = selectedFile.name; // Suponiendo que aquí guardas la URL de la imagen

    //     setImgUrl({
    //     id: Number(id) !== 0 ? articuloManufacturado.imagenes[0].id : 0,
    //     url: imageUrl
    //     });
    // }


    useEffect(() => {
        //console.log(id)
        getAllCategories()
        getAllUnidad()
        if (Number(id) != 0) {
            getArticuloManufacturado("http://localhost:8080/articuloManufacturados", Number(id))

        }
        // console.log(articuloManufacturado.articuloManufacturadoDetalles)
        //console.log(categoria)
    }, ([]))

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
                {/* <label htmlFor="imagen">Imagen</label>
                <input type="file" name="imagen" id="imagen" onChange={handleFileChange}/> */}
                <label htmlFor="preparacion">Preparación</label>
                <textarea id="preparacion" name="preparacion" defaultValue={articuloManufacturado.preparacion} onChange={(e) => setArticulosManufacturado({ ...articuloManufacturado, preparacion: e.target.value })}></textarea>
                <div style={{ display: "flex", justifyContent: "space-between", margin:"1rem 0" }}>
                    <label htmlFor="ingrediente">Ingredientes</label>
                    <Button variant="primary" onClick={handleShow}>
                        Añadir Ingrediente
                    </Button>
                </div>
                {articuloManufacturado.articuloManufacturadoDetalles && articuloManufacturado.articuloManufacturadoDetalles.length > 0 && (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Denominación</th>
                                <th>Cantidad</th>
                                <th>Precio de Venta</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articuloManufacturado.articuloManufacturadoDetalles.map((detalle) => (
                                <tr key={detalle.id}>
                                    <td>
                                        <p>{detalle.articuloInsumo?.denominacion}</p>
                                    </td>
                                    <td>
                                        <input type='number' defaultValue={detalle.cantidad} onChange={e => detalle.cantidad = Number(e.target.value)} />
                                    </td>
                                    <td>
                                        <p>{detalle.articuloInsumo?.precioVenta}</p>
                                    </td>
                                    <td>
                                        <button style={{ marginBottom: 10 }} className="btn btn-danger" onClick={() => deleteInsumo(detalle.articuloInsumo)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
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
                        <ul className="listaInsumo" style={{}}>
                            {articuloManufacturado.articuloManufacturadoDetalles && articuloManufacturado.articuloManufacturadoDetalles.map((detalle) => (
                                <li key={detalle.articuloInsumo.id}>
                                    {detalle.articuloInsumo?.denominacion}
                                    <svg onClick={() => deleteInsumo(detalle.articuloInsumo)} style={{ position: "absolute", top: "3px", right: "1px" }} width="14px" height="14px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 17L16.8995 7.10051" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M7 7.00001L16.8995 16.8995" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </li>
                            ))}
                        </ul>
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