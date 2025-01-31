import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticuloInsumoService from "../../Functions/Services/ArticuloInsumoService";
import masObject from "../../assets/circle-plus-svgrepo-com.svg";
import IArticuloInsumo from "../../Entities/IArticuloInsumo";
import { Button, Form, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import ICategoria from "../../Entities/ICategoria";

interface ISucursalDto {
    id: number;
    nombre: string;
    horarioApertura: string;
    horarioCierre: string;
    baja: boolean;
}

export default function GrillaInsumo() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;

    const [sucursales, setSucursales] = useState<ISucursalDto[]>([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | null>(null);
    const [allArticulosInsumos, setAllArticulosInsumos] = useState<IArticuloInsumo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [categorias, setCategorias] = useState<ICategoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | "">("");
    const [filtrarPorCategoria, setFiltrarPorCategoria] = useState(false);

    const itemsPerPage = 15; // Número de elementos por página

    // Función para obtener lista de sucursales
    const obtenerSucursales = async () => {
        try {
            const result = new ArticuloInsumoService(apiUrl);
            const data = await result.getSucursales();
            setSucursales(data || []);
            //console.log(data);
        } catch (error) {
            console.error("Error al obtener sucursales:", error);
        }
    };

    // Función para obtener categorías
    const obtenerCategorias = async () => {
        try {
            const result = new ArticuloInsumoService(apiUrl);
            const data = await result.getCategorias();
            setCategorias(data.filter((categoria: ICategoria) => categoria.esInsumo) || []);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    };

    // const obtenerCategoriasHijas = (idCategoria: number): number[] => {
    //     const categoriasHijas = categorias.filter(cat => cat.categoriaPadre.id === idCategoria);
    //     return [idCategoria, ...categoriasHijas.map(cat => cat.id)];
    // };

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
        obtenerCategorias();
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

    const handleCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const categoriaId = event.target.value ? parseInt(event.target.value) : "";
    
        // Si la categoría seleccionada es una categoría padre, filtrar por subcategorías
        setCategoriaSeleccionada(categoriaId);
    };

    const getStockColor = (stock: number, min: number, max: number) => {
        if (stock <= min) return "#ff4d4d"; // Rojo
        if (stock >= max) return "#4caf50"; // Verde
    
        const range = max - min;
        const position = (stock - min) / range;
    
        const red = position < 0.5 ? 255 : 255 - (position - 0.5) * 510;
        const green = position < 0.5 ? position * 510 : 255;
        
        return `rgb(${red}, ${green}, 50)`;
    };
    

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= Math.ceil(filteredInsumos.length / itemsPerPage)) {
            setCurrentPage(newPage);
        }
    };

    const handleFiltrarPorCategoria = () => {
        setFiltrarPorCategoria(true);
    };

    const filteredInsumos = allArticulosInsumos.filter((insumo) => {
        // Buscar la categoría seleccionada
        const categoriaSeleccionadaObj = categorias.find(categoria => categoria.id === categoriaSeleccionada);
        
        // Si la categoría seleccionada es una categoría padre, incluimos sus subcategorías
        const perteneceACategoriaPadre =
            categoriaSeleccionada === "" ||
            insumo.categoria.id === categoriaSeleccionada ||
            (categoriaSeleccionadaObj && categoriaSeleccionadaObj.categoriaPadre === null &&
                categorias.some(c => c.categoriaPadre?.id === categoriaSeleccionada && insumo.categoria.id === c.id));
        
        return insumo.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) &&
               (!filtrarPorCategoria || perteneceACategoriaPadre);
    });
    

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

            <div className="d-flex gap-3 mb-3">
                <Button variant="info" onClick={handleFiltrarPorCategoria}>Filtrar por Categoría</Button>
                <Form.Select onChange={handleCategoriaChange} value={categoriaSeleccionada || ""}>
                    <option value="">Todas las categorías</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.denominacion}
                        </option>
                    ))}
                </Form.Select>
            </div>

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
                    <th className="text-center align-middle">Imagen</th>
                        <th className="text-center align-middle">Denominación</th>
                        <th className="text-center align-middle">Categoría</th>
                        <th className="text-center align-middle">Stock Actual</th>
                        <th className="text-center align-middle">U. Medida</th>
                        <th className="text-center align-middle">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInsumos.length > 0 ? (
                        paginatedInsumos.map((insumo) => (
                            <tr key={insumo.id}>
                                <td className="text-center align-middle">
                                    {insumo.imagenes?.[0]?.url ? (
                                        <img
                                            width={200}
                                            height={200}
                                            style={{ objectFit: "contain", maxWidth: "90px", maxHeight: "90px" }}
                                            src={`${insumo.imagenes[0].url}`}
                                            alt="imagenArticulo"
                                        />
                                    ) : null}
                                </td>
                                <td className="text-center align-middle">{insumo.denominacion}</td>
                                <td className="text-center align-middle">{insumo.categoria.denominacion}</td>
                                <td className="text-center align-middle" style={{ backgroundColor: getStockColor(insumo.stockActual, insumo.stockMinimo, insumo.stockMaximo) }}>
                                    <OverlayTrigger placement="top" overlay={<Tooltip>{`Stock: ${insumo.stockActual}`}</Tooltip>}>
                                        <span>{insumo.stockActual}</span>
                                    </OverlayTrigger>
                                </td>
                                <td className="text-center align-middle">{insumo.unidadMedida.denominacion}</td>
                                <td className="text-center align-middle">
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
