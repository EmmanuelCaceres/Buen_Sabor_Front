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
    const [articulosInsumos, setArticulosInsumos] = useState<IArticuloInsumo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
        const result = new ArticuloInsumoService(`${apiUrl}articulosInsumos/porSucursal/${idSucursal}?page=${page-1}&size=20`);
        result.getPaginatedInsumos()
            .then(data => {
                if (data) {
                    setArticulosInsumos(data.content);
                    setTotalPages(data.totalPages);
                } else {
                    console.error("No se encontraron datos.");
                    setArticulosInsumos([]);
                }
            })
            .catch(error => {
                console.error("Error al obtener los datos:", error);
                setArticulosInsumos([]);
            });
    };

    useEffect(() => {
        obtenerSucursales();
    }, []);

    const handleSucursalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const idSucursal = parseInt(event.target.value);
        setSucursalSeleccionada(idSucursal);
        setCurrentPage(1); // Reinicia la página al cambiar de sucursal
        mostrarDatosPaginados(idSucursal, 1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        if (sucursalSeleccionada) {
            mostrarDatosPaginados(sucursalSeleccionada, newPage);
        }
    };

    const handleDelete = (id: number) => {
        new ArticuloInsumoService(`${apiUrl}articulosInsumos`).delete(id);
        window.location.reload();
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
                    {articulosInsumos.length > 0 ? (
                        articulosInsumos.map((insumo: IArticuloInsumo) => (
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
