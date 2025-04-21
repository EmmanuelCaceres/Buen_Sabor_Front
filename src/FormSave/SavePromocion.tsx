import { useEffect, useState } from 'react'
import IPromocion from '../Entities/IPromocion';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

const SavePromocion = () => {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const { id } = useParams();
    const navigate = useNavigate();
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
    });
    const [articuloManufacturado, setArticuloManufacturado] = useState<IArticuloManufacturado[]>([]);
    const [articuloManufacturadoPromocion, setArticuloManufacturadoPromocion] = useState<IArticuloManufacturadoPromocion[]>([]);
    const {setState} = useModalContext();
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
    const handleCantidadChange = (id: number, nuevaCantidad: number) => {
        setArticuloManufacturadoPromocion(prevArticulos =>
            prevArticulos.map(articulo =>
                articulo.id === id
                    ? { ...articulo, cantidad: isNaN(nuevaCantidad) ? 1 : nuevaCantidad } // Actualiza la cantidad si el ID coincide, maneja NaN
                    : articulo // Mantiene el artículo sin cambios si el ID no coincide
            )
        );

    };

    const savePromocion = async (event?: React.MouseEvent) => {
        if(event){
            event?.preventDefault();
        }

        const detallePromocion: IPromocionDetalle[] = articuloManufacturadoPromocion.map((articulo) => ({
            id: 0,
            baja: false,
            cantidad: articulo.cantidad,
            articulo: articulo.id,
        }));
        console.log(detallePromocion);
        
        setPromocion({...promocion, promocionDetalles: detallePromocion});
        

        console.log(promocion);
        
        if (Number(id) !== 0) {
            await new PromocionService(`${apiUrl}promociones`).put(Number(id), promocion);
        } else {
            await new PromocionService(`${apiUrl}promociones/create`).post(promocion);
        }
        alert("Categoria guardada con exito!");
        navigate(-1);
    }

    useEffect(() => {
        obtenerArticulos();
    } , [apiUrl]);

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
                            onChange={(e)=> setPromocion({...promocion,denominacion:e.target.value})}
                        />
                    </div>
                    <div>
                        <label htmlFor="descripDescuento">Nombre</label>
                        <input
                            type="text"
                            id="descripDescuento"
                            name="descripDescuento"
                            onChange={(e)=> setPromocion({...promocion,descripcionDescuento:e.target.value})}
                        />
                    </div>
                    <div>
                        <label htmlFor="promPrice">Precio promocional</label>
                        <input
                            type="number"
                            id="promPrice"
                            name="promPrice"
                            onChange={(e)=> setPromocion({...promocion,precioPromocional: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <input type="file" />
                    </div>
                    <div>
                        <label htmlFor="promDateInit">Fecha de inicio</label>
                        <input
                            type="date"
                            id="promDateInit"
                            name="promDateInit"
                            onChange={(e)=> setPromocion({...promocion,fechaDesde: new Date(e.target.value)})}

                        />
                    </div>
                    <div>
                        <label htmlFor="promDateFinish">Fecha de finalización</label>
                        <input
                            type="date"
                            id="promDateFinish"
                            name="promDateFinish"
                            onChange={(e)=> setPromocion({...promocion,fechaHasta: new Date(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label htmlFor="promTimeInit">Hora de inicio</label>
                        <input
                            type="time"
                            id="promTimeInit"
                            name="promTimeInit"
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
                            onChange={(e)=> {
                                setPromocion({ ...promocion, horaHasta: e.target.value });
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="promType">Tipo de promocion</label>
                        <select name="" id="" onChange={(e)=> setPromocion({...promocion,tipoPromocion: useDiccionarioEnum(e.target.value) as TipoPromocion})}>
                            <option value="HappyHour">Happy Hour</option>
                            <option value="Descuento">Promocion</option>
                        </select>
                    </div>
                <button type="button" onClick={openModal}>Abrir articulos</button>
                <ButtonPrimary label='Guardar' customMethod={savePromocion}/>
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

export default SavePromocion
