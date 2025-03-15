import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticuloInsumoService from "../../Functions/Services/ArticuloInsumoService";
import masObject from "../../assets/circle-plus-svgrepo-com.svg";
import IArticuloInsumo from "../../Entities/IArticuloInsumo";
import { Button, Form, Modal} from "react-bootstrap";
import ICategoria from "../../Entities/ICategoria";
import GrillaGenerica from "./GrillaGenerica";
export default function GrillaInsumo() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;

    const [sucursalSeleccionada] = useState<number | null>(2);
    const [allArticulosInsumos, setAllArticulosInsumos] = useState<IArticuloInsumo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [categorias, setCategorias] = useState<ICategoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<ICategoria | null>(null);
    const [, setFiltrarPorCategoria] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [insumoToDelete, setInsumoToDelete] = useState<IArticuloInsumo | null>(null);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const itemsPerPage = 15; // Número de elementos por página

    // Función para obtener categorías
    const obtenerCategorias = async () => {
        try {
            const result = new ArticuloInsumoService(apiUrl);
            const data = await result.getCategorias();
    
            // Filtrar las categorías que son insumos
            setCategorias(data.filter((categoria: ICategoria) => categoria.esInsumo));
        } catch (error) {
            console.error("Error al obtener categorías:", error);
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
        // obtenerSucursales();
        obtenerCategorias();
    }, []);

    useEffect(() => {
        if (categoriaSeleccionada !== null) {
            setFiltrarPorCategoria(true);
        }
    }, [categoriaSeleccionada]);

    useEffect(() => {
        if (sucursalSeleccionada) {
            cargarTodosLosDatos(sucursalSeleccionada);
            setCurrentPage(1); // Reinicia la página al cambiar de sucursal
            
        }
    }, [sucursalSeleccionada]);

    // const getStockColor = (stock: number, min: number, max: number) => {
    //     if (stock <= min) return "#ff4d4d"; // Rojo
    //     if (stock >= max) return "#4caf50"; // Verde
    
    //     const range = max - min;
    //     const position = (stock - min) / range;
    
    //     const red = position < 0.5 ? 255 : 255 - (position - 0.5) * 510;
    //     const green = position < 0.5 ? position * 510 : 255;
        
    //     return `rgb(${red}, ${green}, 50)`;
    // };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= Math.ceil(filteredInsumos.length / itemsPerPage)) {
            setCurrentPage(newPage);
        }
    };

    const handleFiltrarPorCategoria = () => {
        setFiltrarPorCategoria(true);
    };

    const handleDelete = (id: number) => {
        const insumo = allArticulosInsumos.find(insumo => insumo.id === id);
        if (insumo) {
            setInsumoToDelete(insumo);
            setShowDeleteConfirmation(true);
        }
    };
    
    const handleCloseFilterModal = () => setShowFilterModal(false);
    const handleShowFilterModal = () => setShowFilterModal(true);

    const filteredInsumos = allArticulosInsumos.filter((insumo) => {
        console.log(`insumo:`, JSON.stringify(insumo, null, 2));
        // Verificar si la categoría seleccionada es válida
        const categoriaSeleccionadaObj = categorias.find(categoria => categoria.id === categoriaSeleccionada?.id);
    
        // Verificar el valor de categoriaSeleccionadaObj
    
        // Si la categoría seleccionada es nula, mostramos todos los insumos
        if (!categoriaSeleccionada) {
            return insumo.denominacion.toLowerCase().includes(searchTerm.toLowerCase());
        }
    
        // Si la categoría seleccionada es una categoría padre, incluir sus subcategorías
        const perteneceACategoria = categoriaSeleccionadaObj?.categoriaPadre === null
    ? insumo.categoria?.id === categoriaSeleccionadaObj.id || 
      categorias.some(c => c.categoriaPadre?.id === categoriaSeleccionadaObj.id && insumo.categoria?.id === c.id)
    : insumo.categoria?.id === categoriaSeleccionadaObj?.id;
    
        // Filtrar insumos por denominación y por categoría
        return insumo.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) && perteneceACategoria;
    });
    
    // Datos paginados para la página actual
    const paginatedInsumos = filteredInsumos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const confirmDelete = async () => {
        if (insumoToDelete) {
            try {
                const result = new ArticuloInsumoService(apiUrl);
                await result.deleteInsumo(insumoToDelete.id); // Assuming you have a deleteInsumo method in your service
                // After successful deletion, update the state to remove the deleted insumo
                setAllArticulosInsumos(allArticulosInsumos.filter(insumo => insumo.id !== insumoToDelete.id));
                alert("Insumo eliminado con éxito."); // Or a better notification system
            } catch (error) {
                console.error("Error al eliminar insumo:", error);
                alert("Error al eliminar el insumo. Inténtelo nuevamente."); // Or a better error handling
            } finally {
                setShowDeleteConfirmation(false);
                setInsumoToDelete(null);
            }
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
        setInsumoToDelete(null);
    };

    const renderCategorias = (categoriaPadreId: number | null = null, nivel = 0) => {
        return categorias
            .filter(cat => (cat.categoriaPadre ? cat.categoriaPadre.id : null) === categoriaPadreId)
            .map(cat => (
                <div key={cat.id} style={{ marginLeft: `${nivel * 20}px`, cursor: "pointer" }}>
                    <Button variant="link" onClick={() => handleCategoriaClick(cat)}>
                        {nivel === 0 ? <strong>{cat.denominacion}</strong> : `↳ ${cat.denominacion}`}
                    </Button>
                    {renderCategorias(cat.id, nivel + 1)} {/* Ahora acepta `number` sin error */}
                </div>
            ));
    };

    const handleCategoriaClick = (categoria : ICategoria) => {
        setCategoriaSeleccionada(categoria);
        setShowFilterModal(false);
    };

    const limpiarFiltro = () => {
        setCategoriaSeleccionada(null);
    };
    

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center">
                <h1>Insumos</h1>
                <Link to={"save/0"} className="btn btn-primary">
                    <img src={masObject} alt="Crear Insumo" style={{ marginRight: "8px" }} />
                    Crear Insumo
                </Link>
            </div>


            {/*filtro de categoria*/}
            <div className="d-flex gap-3 mb-3">
                <Modal show={showFilterModal} onHide={handleCloseFilterModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Filtrar por Categoría</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>{renderCategorias()}</div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFilterModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleFiltrarPorCategoria}>
                            Filtrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {/* Buscador */}
            <div className="d-flex gap-3 mb-3">
                <Form.Control
                    type="text"
                    placeholder="Buscar insumo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-3"
                />
                <Button variant="info" style={{ width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleShowFilterModal}>
                    <img src="/src/assets/filter.svg" alt="Filtrar" style={{ width: 20, height: 20 }} />
                </Button>

            </div>
            {categoriaSeleccionada && (
                <div
                    style={{
                        marginLeft: "10px",
                        marginRight: "0",
                        cursor: "pointer",
                        display: 'flex',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        borderRadius: '50px',
                        padding: '0.25rem 0.5rem',
                        whiteSpace: 'nowrap',
                        maxWidth: 'fit-content',
                    }}
                    onClick={limpiarFiltro}
                >
                    {categoriaSeleccionada.denominacion} ✖
                </div>
            )}

            <GrillaGenerica
                data={paginatedInsumos}
                propertiesToShow={["imagenes", "denominacion", "categoria", "stockActual", "unidadMedida"]}
                editItem={`/panel-usuario/insumos/save/`}
                deleteFunction={(id: number) => handleDelete(id)}
            />
            

            {/* Confirmation Modal */}
            {showDeleteConfirmation && insumoToDelete && (
                <div className="modal show" style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar Eliminación</h5>
                                <button type="button" className="btn-close" onClick={cancelDelete}></button>
                            </div>
                            <div className="modal-body">
                                ¿Está seguro de que desea eliminar el insumo <strong>{insumoToDelete.denominacion}</strong>?
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" onClick={cancelDelete}>Cancelar</Button>
                                <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
