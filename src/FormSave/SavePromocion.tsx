import { useEffect, useState } from 'react'
import IPromocion from '../Entities/IPromocion';
import { Link,  useParams } from 'react-router-dom';
import ArticuloManufacturadoService from '../Functions/Services/ArticuloManufacturadoService';
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import "./SavePromocion.css"
import { CustomSelect } from '../Components/CustomSelect/CustomSelect';
import IArticuloManufacturado from '../Entities/IArticuloManufacturado';
import { ButtonPrimary, Modal } from '../Components';
import { useModalContext } from '../Components/Modal/context/ModalContext';
import IArticuloManufacturadoPromocion from '../Entities/IArticuloManufacturadoPromocion';
import PromocionService from '../Functions/Services/PromocionService';
import { TipoPromocion } from '../Entities/TipoPromocion';
import { IPromocionDetalle } from '../Entities/IPromocionDetalle';
import { useDiccionarioEnum } from '../Hooks/useDiccionario';
import ImagenPromocionService from '../Functions/Services/ImagenPromocionService';
import { useSucursal } from '../context/SucursalContext';
//import ImagenPromocionService from '../Functions/Services/ImagenPromocionService';

export default function SavePromocion () {
    const { sucursalId } = useSucursal();
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [promocion,setPromocion] = useState<IPromocion>({
        id: 0,
        baja: false,
        denominacion: "",
        descripcionDescuento:"",
        precioPromocional: 0,
        fechaDesde: new Date(),
        fechaHasta: new Date(),
        horaDesde: "",
        horaHasta: "",
        tipoPromocion: TipoPromocion.HappyHour,
        imagenes: [],
        promocionDetalles: [],
        idsSucursal: 0/*{
            id: 0,
            nombre: '',
            horarioApertura: '',
            horarioCierre: '',
            baja: false,
            esCasaMatriz: false,
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
        }*/,   
    });
    const [articuloManufacturado, setArticuloManufacturado] = useState<IArticuloManufacturado[]>([]);
    const [articuloManufacturadoPromocion, setArticuloManufacturadoPromocion] = useState<IArticuloManufacturadoPromocion[]>([]);
    const {setState} = useModalContext();
    const traducirEnum = useDiccionarioEnum();

        const openModal = () =>{
            setState(true)
        }

    async function obtenerArticulos(){
        const result = new ArticuloManufacturadoService(
            `${apiUrl}articulosManufacturados`
        );
        const data = await result.getAll();
        if(Array.isArray(data)) {
            setArticuloManufacturado(data);
        }
        console.log(data);
        
    }
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
            if (promocion.imagenes?.length) {
                const firstImageUrl = promocion.imagenes[0].url;
                setSelectedImage(firstImageUrl); // Establece la imagen inicial desde los datos
            }
        }, [promocion.imagenes]);

    const getPromocionById = async (id: number) => {
        const result = new PromocionService(`${apiUrl}promociones`);
        const data = await result.get(id);
        if (data) {
            console.log("PROMO DATA:", data); // 👈 Acá podés ver en consola cómo viene
            setPromocion(data);
            // Si tiene detalles (artículos), también los podés setear
            const detalles = data.promocionDetalles.map((detalle: IPromocionDetalle) => ({
                id: detalle.articulo.id,
                denominacion: detalle.articulo.denominacion,
                cantidad: detalle.cantidad
            }));
            setArticuloManufacturadoPromocion(detalles);
        }
    };
    
    const handleCantidadChange = (id: number, nuevaCantidad: number) => {
        setArticuloManufacturadoPromocion(prevArticulos =>
            prevArticulos.map(articulo =>
                articulo.id === id
                    ? { ...articulo, cantidad: isNaN(nuevaCantidad) ? 1 : nuevaCantidad } // Actualiza la cantidad si el ID coincide, maneja NaN
                    : articulo // Mantiene el artículo sin cambios si el ID no coincide
            )
        );

    };

    const guardarPromocion = async (event?: React.MouseEvent) => {
        if (event) event.preventDefault();
    
        const currentImageUrl = promocion.imagenes?.length ? promocion.imagenes[0].url : null;
        const isNewImage = selectedImage && selectedImage !== currentImageUrl;
        
    
        const detallePromocion: IPromocionDetalle[] = articuloManufacturadoPromocion.map((articulo) => ({
            id: 0,
            baja: false,
            cantidad: articulo.cantidad,
            articulo: {
                id: articulo.id,
                denominacion: articulo.denominacion,
            },
        }));
    
        const promocionConSucursal: IPromocion = {
            ...promocion,
            promocionDetalles: detallePromocion,
            idsSucursal: sucursalId!,
        };
    
        // 💡 Si no hay una nueva imagen, eliminamos el campo "imagenes"
        const promocionAEnviar: IPromocion = { ...promocionConSucursal };

        // Si no hay nueva imagen, mantené la imagen actual
        if (!isNewImage && promocion.imagenes?.length) {
            promocionAEnviar.imagenes = [...promocion.imagenes];
        }


        try {
            let promocionId = Number(id);
            const promService = new PromocionService(`${apiUrl}promociones`);
            console.log("Promoción que se envía:", promocionAEnviar);

            if (promocionId !== 0) {
                await promService.put(promocionId, promocionAEnviar);
            } else {
                const nuevaPromo = await promService.post(promocionAEnviar);
                promocionId = nuevaPromo.id;
            }

            // Eliminar imagen anterior solo si hay una nueva diferente
            if (isNewImage && currentImageUrl) {
                const publicIdToDelete = currentImageUrl.split('/')[6].split('.')[0];
                try {
                    const resultDelete = new ImagenPromocionService(`${apiUrl}imagenesPromocion`);
                    await resultDelete.deleteImagen(publicIdToDelete, promocion.imagenes[0].id);
                    console.log("Imagen anterior eliminada correctamente");
                } catch (error) {
                    console.error("Error al eliminar la imagen anterior:", error);
                    alert("Error al eliminar la imagen anterior. La promoción no será guardada.");
                    return;
                }
            }


            // Subir nueva imagen si está seleccionada y es diferente de la actual
            if (isNewImage) {
                try {
                    const blob = await fetch(selectedImage).then((res) => res.blob());
                    const file = new File([blob], "imagen.jpg", { type: "image/jpeg" });
                    const formData = new FormData();
                    formData.append("uploads", file);

                    // Servicio para subir la imagen
                    const result = new ImagenPromocionService(`${apiUrl}imagenesPromocion/uploads`);
                    const uploadedImage = await result.postImagen(formData,promocion.id);

                    if (uploadedImage && uploadedImage.id) {
                        promocionAEnviar.imagenes = [{
                            id: uploadedImage.id,
                            url: uploadedImage.url,
                        }];
                        console.log("Imagen subida correctamente:", uploadedImage);
                    } else {
                        console.error("Error en la subida de imagen: No se recibió ID válido.");
                        alert("Error al subir la nueva imagen. La promoción no será guardada.");
                        return;
                    }
                } catch (error) {
                    console.error("Error al subir la imagen:", error);
                    alert("Error al subir la nueva imagen. La promoción no será guardada.");
                    return;
                }
            } else {
                console.log("La imagen no ha cambiado, no se subirá nuevamente.");
            }

            } catch (error) {
                console.error("Error al guardar la promoción:", error);
            }
    }
    
    
    

    useEffect(() => {
        obtenerArticulos();
        if (Number(id) !== 0) {
            getPromocionById(Number(id));
        }
    }, [id]);
    

    return (
        <>
            <div className='container'>
            <Link to="/panel-usuario/promociones" className="btnVolver">
                    <img width={24} height={24} src={arrow_left} alt="arrow_left" />
                    <p style={{ margin: "0" }}>Volver</p>
                </Link>
                <form action="" className='formProm'>
                    <div>
                        <label htmlFor="denominacion">Denominacion</label>
                        <input
                            type="text"
                            id="denominacion"
                            name="denominacion"
                            value={promocion.denominacion}
                            onChange={(e)=> setPromocion({...promocion,denominacion:e.target.value})}
                        />
                    </div>
                    <div>
                        <label htmlFor="descripDescuento">Nombre</label>
                        <input
                            type="text"
                            id="descripDescuento"
                            name="descripDescuento"
                            value={promocion.descripcionDescuento}
                            onChange={(e)=> setPromocion({...promocion,descripcionDescuento:e.target.value})}
                        />
                    </div>
                    <div>
                        <label htmlFor="promPrice">Precio promocional</label>
                        <input
                            type="number"
                            id="promPrice"
                            name="promPrice"
                            value={promocion.precioPromocional}
                            onChange={(e)=> setPromocion({...promocion,precioPromocional: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                    <input type="file" onChange={onFileChange} />
                        {selectedImage && (
                            <div>
                                <h3>Vista previa de la imagen seleccionada:</h3>
                                <img src={selectedImage} alt="Vista previa" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="promDateInit">Fecha de inicio</label>
                        <input
                            type="date"
                            id="promDateInit"
                            name="promDateInit"
                            value={promocion.fechaDesde.toString().split('T')[0]}
                            onChange={(e)=> setPromocion({...promocion,fechaDesde: new Date(e.target.value)})}

                        />
                    </div>
                    <div>
                        <label htmlFor="promDateFinish">Fecha de finalización</label>
                        <input
                            type="date"
                            id="promDateFinish"
                            name="promDateFinish"
                            value={promocion.fechaHasta.toString().split('T')[0]}
                            onChange={(e)=> setPromocion({...promocion,fechaHasta: new Date(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label htmlFor="promTimeInit">Hora de inicio</label>
                        <input
                            type="time"
                            id="promTimeInit"
                            name="promTimeInit"
                            value={promocion.horaDesde}
                            onChange={(e)=> {
                                setPromocion({ ...promocion, horaDesde: e.target.value});
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="promTimeFinish">Hora de finalización</label>
                        <input
                            type="time"
                            id="promTimeFinish"
                            name="promTimeFinish"
                            value={promocion.horaHasta}
                            onChange={(e)=> {
                                setPromocion({ ...promocion, horaHasta: e.target.value });
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="promType">Tipo de promocion</label>
                        <select
                            id="promType"
                            value={promocion.tipoPromocion}
                            onChange={(e) =>
                                setPromocion({
                                    ...promocion,
                                    tipoPromocion: traducirEnum(e.target.value) as TipoPromocion,
                                })
                            }
                        >
                            <option value="HappyHour">Happy Hour</option>
                            <option value="Descuento">Promocion</option>
                        </select>

                    </div>
                <button type="button" onClick={openModal}>Abrir articulos</button>
                <ButtonPrimary label='Guardar' customMethod={guardarPromocion}/>
                </form>
                    <Modal children={
                        <>
                        <h2>Articulos</h2>
                        <div style={{display: "flex", justifyContent: "space-between",height:"200px"}}>
                            <CustomSelect options={articuloManufacturado} onChange={setArticuloManufacturadoPromocion} initialSelected={articuloManufacturadoPromocion}/>
                            <div>
                                
                                        {articuloManufacturadoPromocion.map((articulo) => (
                                            <div key={articulo.id}>
                                                <p>{articulo.denominacion}</p>
                                                <input type="number" 
                                                    name={`cant-${articulo.id}`} 
                                                    id={`cant-${articulo.id}`} 
                                                    value={articulo.cantidad} 
                                                    onChange={(e) => handleCantidadChange(articulo.id, parseInt(e.target.value, 10))}
                                                    min="1"/>
                                            </div>
                                        ))}
                                 
                            </div>
                        </div>
                        </>
                     }/>
            </div>
        </>
    )
}
