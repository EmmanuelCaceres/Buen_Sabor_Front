import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ArticuloInsumoService from '../../Functions/Services/ArticuloInsumoService';
import masObject from '../../assets/circle-plus-svgrepo-com.svg';
import IArticuloInsumo from '../../Entities/IArticuloInsumo';
import { Button, Form, Table } from 'react-bootstrap';
import { IPaginatedResponse } from '../../Entities/IPaginatedResponse';

interface ISucursalDto {
    id: number;
    nombre: string;
    horarioApertura: string;
    horarioCierre: string;
    baja: boolean;
}

export default function GrillaArticulo() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;

    const [sucursales, setSucursales] = useState<ISucursalDto[]>([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | null>(null);
    const [todosLosInsumos, setTodosLosInsumos] = useState<IArticuloInsumo[]>([]);  // Estado para todos los insumos
    const [articulosFiltrados, setArticulosFiltrados] = useState<IArticuloInsumo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [busqueda, setBusqueda] = useState<string>('');

    // Función para obtener lista de sucursales
    const obtenerSucursales = () => {
        const result = new ArticuloInsumoService(apiUrl);
        result.getSucursales()
            .then((data: IPaginatedResponse<ISucursalDto> | null) => {
                if (data && Array.isArray(data)) {
                    setSucursales(data);
                } else {
                    setSucursales([]);
                    console.log("No se encontraron sucursales.");
                }
            })
            .catch(error => {
                console.error("Error al obtener sucursales:", error);
                setSucursales([]);
            });
    };

    // Función para obtener insumos con paginación
    const mostrarDatosPaginados = (idSucursal: number, page: number) => {
        console.log(`Sucursal ID: ${idSucursal}, Página: ${page}`);
        const result = new ArticuloInsumoService(`${apiUrl}articulosInsumos/porSucursal/${idSucursal}?page=${page - 1}&size=20`);
        result.getPaginatedInsumos()
            .then(data => {
                if (data) {
                    setTodosLosInsumos(data.content); // Cargar todos los insumos sin filtrar
                    const totalPagesCalculated = Math.ceil(data.totalElements / 20); // Total de páginas basadas en todos los insumos
                    setTotalPages(totalPagesCalculated); // Asegurarse de que `totalPages` se calcule correctamente
                    console.log(`Total de páginas: ${totalPagesCalculated}`);
                    // Filtrar después de que se cargan todos los insumos
                    filtrarInsumos(busqueda, data.content);
                } else {
                    console.error("No se encontraron datos.");
                }
            })
            .catch(error => {
                console.error("Error al obtener los datos:", error);
            });
    };

    // Filtrar insumos por búsqueda
    const filtrarInsumos = (query: string, insumos: IArticuloInsumo[]) => {
        const filtered = insumos.filter(insumo => 
            insumo.denominacion.toLowerCase().includes(query.toLowerCase())
        );
        setArticulosFiltrados(filtered);
        setTotalPages(Math.ceil(filtered.length / 20)); // Ajustar el total de páginas según los insumos filtrados
    };

    useEffect(() => {
        obtenerSucursales();
    }, []);

    useEffect(() => {
        if (sucursalSeleccionada) {
            setTodosLosInsumos([]);  // Limpiar los insumos almacenados al cambiar la sucursal
            mostrarDatosPaginados(sucursalSeleccionada, currentPage);
        }
    }, [sucursalSeleccionada, currentPage]);

    useEffect(() => {
        if (todosLosInsumos.length > 0) {
            filtrarInsumos(busqueda, todosLosInsumos); // Filtrar los insumos cuando cambien los insumos o la búsqueda
        }
    }, [todosLosInsumos, busqueda]);

    const handleSucursalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const idSucursal = parseInt(event.target.value);
        setSucursalSeleccionada(idSucursal);
        setCurrentPage(1); // Reinicia la página al cambiar de sucursal
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await new ArticuloInsumoService(`${apiUrl}articulosInsumos`).delete(id);
            if (sucursalSeleccionada) {
                mostrarDatosPaginados(sucursalSeleccionada, currentPage);
            }
        } catch (error) {
            console.error("Error al eliminar insumo:", error);
        }
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

            {/* Mostrar buscador solo cuando se haya seleccionado una sucursal */}
            {sucursalSeleccionada && (
                <Form.Control 
                    type="text" 
                    placeholder="Buscar insumo..." 
                    value={busqueda} 
                    onChange={(e) => setBusqueda(e.target.value)} 
                    className="mb-3"
                />
            )}

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
                    {articulosFiltrados.length > 0 ? (
                        articulosFiltrados.slice((currentPage - 1) * 20, currentPage * 20).map((insumo: IArticuloInsumo) => (
                            <tr key={insumo.id}>
                                <td>
                                    {insumo.imagenes?.[0]?.url ? (
                                        <img 
                                            width={50} 
                                            height={50}
                                            style={{ objectFit: 'contain', maxWidth: '50px', maxHeight: '50px' }}
                                            src={`${insumo.imagenes[0].url}`} 
                                            alt="imagenArticulo" 
                                        />
                                    ) : null}
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
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No se encontraron insumos.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Controles de paginación */}
            {totalPages > 1 && (
                <div className="pagination d-flex justify-content-between align-items-center mt-3">
                    <Button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}>
                        Anterior
                    </Button>
                    <span>{`Página ${currentPage} de ${totalPages}`}</span>
                    <Button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}>
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
}
