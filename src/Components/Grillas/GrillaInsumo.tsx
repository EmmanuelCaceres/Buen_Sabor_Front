import { SetStateAction, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ArticuloInsumoService from '../../Functions/Services/ArticuloInsumoService';
import masObject from '../../assets/circle-plus-svgrepo-com.svg';
import IArticuloInsumo from '../../Entities/IArticuloInsumo';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';

// Define el tipo para sucursales, como ISucursalDto
interface ISucursalDto {
    id: number;
    nombre: string;
    horarioApertura: string;
    horarioCierre: string;
    baja: boolean;
}

export default function GrillaArticulo() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;

    const [inputValue, setInputValue] = useState('');
    const [sucursales, setSucursales] = useState<ISucursalDto[]>([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | null>(null);
    const [articulosInsumos, setArticulosinsumos] = useState<IArticuloInsumo[]>([]);

    // Función para obtener lista de sucursales
    const obtenerSucursales = () => {
        const result = new ArticuloInsumoService(apiUrl); // Asegúrate de pasar solo la base URL aquí
        result.getSucursales() // Usa el método que creaste para obtener sucursales
            .then((data: ISucursalDto[] | null) => { // Aquí especificamos el tipo esperado para 'data'
                if (data) {
                    setSucursales(data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };
    


    // Función para obtener insumos de la sucursal seleccionada
    const mostrarDatos = (idSucursal: number) => {
        const result = new ArticuloInsumoService(`${apiUrl}articulosInsumos/porSucursal/${idSucursal}`);
        result.getAll()
            .then((data) => {
                console.log("Datos obtenidos:", data);
                setArticulosinsumos(data || []); // Accede a `content` si el backend devuelve una página
            })
            .catch(error => {
                console.error("Error al obtener los datos:", error);
            });
    };
    
    useEffect(() => {
        obtenerSucursales();
    }, []);

    const handleSucursalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const idSucursal = parseInt(event.target.value);
        setSucursalSeleccionada(idSucursal);
        mostrarDatos(idSucursal); // Llama a mostrarDatos con el idSucursal seleccionado
    };

    const handleDelete = (id:number) => {
        new ArticuloInsumoService(`${apiUrl}articulosInsumos`).delete(id);
        window.location.reload();
    }

    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setInputValue(event.target.value);
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center my-3">
                <h1>Insumos</h1>
                <Link to={'save/0'} className='btn btn-primary'>
                    <img src={masObject} alt="Crear Insumo" style={{ marginRight: '8px' }} />
                    Crear Insumo
                </Link>
            </div>

            {/* Selector de sucursales */}
            <Form.Select onChange={handleSucursalChange} value={sucursalSeleccionada || ''} className="mb-3">
                <option value="">Selecciona una sucursal</option>
                {sucursales.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                    </option>
                ))}
            </Form.Select>

            {/* Tabla de Insumos */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Denominación</th>
                        <th>Categoría</th>
                        <th>Unidad de Medida</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {articulosInsumos.map((insumo: IArticuloInsumo) => (
                        <tr key={insumo.id}>
                            <td>
                                <img width={50} height={50} src={`${apiUrl}imagenArticulos/uploads/${insumo.imagenes[0].url}`} alt="imagenArticulo" />
                            </td>
                            <td>{insumo.denominacion}</td>
                            <td>{insumo.categoria.denominacion}</td>
                            <td>{insumo.unidadMedida.denominacion}</td>
                            <td>
                                <Link to={"save/" + insumo.id} className="btn btn-warning me-2">
                                    Editar
                                </Link>
                                <Button variant="danger" onClick={() => handleDelete(insumo.id)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
