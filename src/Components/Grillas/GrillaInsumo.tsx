import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticuloInsumoService from "../../Functions/Services/ArticuloInsumoService";
import masObject from "../../assets/circle-plus-svgrepo-com.svg";
import IArticuloInsumo from "../../Entities/IArticuloInsumo";
import { Button, Form, Table } from "react-bootstrap";

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
    const [allArticulosInsumos, setAllArticulosInsumos] = useState<IArticuloInsumo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const itemsPerPage = 15; // Número de elementos por página

    // Función para obtener lista de sucursales
    const obtenerSucursales = async () => {
        try {
            const result = new ArticuloInsumoService(apiUrl);
            const data = await result.getSucursales();
            setSucursales(data || []);
            console.log(data);
        } catch (error) {
            console.error("Error al obtener sucursales:", error);
        }
    };

    // Función para cargar todos los datos en un solo array
    const cargarTodosLosDatos = async (idSucursal: number) => {
        const allData: IArticuloInsumo[] = [];
        let page = 0;

        try {
            let hasMoreData = true;
            while (hasMoreData) {
                const result = new ArticuloInsumoService(
                    `${apiUrl}articulosInsumos/porSucursal/${idSucursal}?page=${page}&size=20`
                );
                const data = await result.getPaginatedInsumos();

                if (data && data.content) {
                    allData.push(...data.content);

                    if (data.last) {
                        hasMoreData = false;
                    } else {
                        page++;
                    }
                } else {
                    hasMoreData = false;
                }
            }

            setAllArticulosInsumos(allData);
        } catch (error) {
            console.error("Error al cargar todos los datos:", error);
        }
    };

    useEffect(() => {
        obtenerSucursales();
    }, []);

    useEffect(() => {
        if (sucursalSeleccionada) {
            cargarTodosLosDatos(sucursalSeleccionada);
            setCurrentPage(1); // Reinicia la página al cambiar de sucursal
        }
    }, [sucursalSeleccionada]);

    const handleSucursalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const idSucursal = parseInt(event.target.value);
        setSucursalSeleccionada(idSucursal);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= Math.ceil(filteredInsumos.length / itemsPerPage)) {
            setCurrentPage(newPage);
        }
    };

    const filteredInsumos = allArticulosInsumos.filter((insumo) =>
        insumo.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Datos paginados para la página actual
    const paginatedInsumos = filteredInsumos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center my-3">
                <h1>Insumos</h1>
                <Link to={"save/0"} className="btn btn-primary">
                    <img src={masObject} alt="Crear Insumo" style={{ marginRight: "8px" }} />
                    Crear Insumo
                </Link>
            </div>

            {/* Selector de sucursales */}
            <Form.Select
                onChange={handleSucursalChange}
                value={sucursalSeleccionada || ""}
                className="mb-3"
            >
                <option value="">Selecciona una sucursal</option>
                {sucursales.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                    </option>
                ))}
            </Form.Select>

            {/* Buscador */}
            <Form.Control
                type="text"
                placeholder="Buscar insumo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
            />

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
                    {paginatedInsumos.length > 0 ? (
                        paginatedInsumos.map((insumo) => (
                            <tr key={insumo.id}>
                                <td>
                                    {insumo.imagenes?.[0]?.url ? (
                                        <img
                                            width={50}
                                            height={50}
                                            style={{ objectFit: "contain", maxWidth: "50px", maxHeight: "50px" }}
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
                                    <Button variant="danger" onClick={() => console.log(`Eliminar: ${insumo.id}`)}>
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
            {filteredInsumos.length > itemsPerPage && (
                <div className="pagination d-flex justify-content-between align-items-center mt-3">
                    <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Anterior
                    </Button>
                    <span>{`Página ${currentPage} de ${Math.ceil(filteredInsumos.length / itemsPerPage)}`}</span>
                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(filteredInsumos.length / itemsPerPage)}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
}
