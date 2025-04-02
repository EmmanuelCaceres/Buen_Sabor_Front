import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ArticuloManufacturadoService from '../../Functions/Services/ArticuloManufacturadoService';
import IArticuloManufacturado from '../../Entities/IArticuloManufacturado';
import masObject from '../../assets/circle-plus-svgrepo-com.svg';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import GrillaGenerica from './GrillaGenerica';
import ICategoria from '../../Entities/ICategoria';

export default function GrillaArticulo() {

    const apiUrl = import.meta.env.VITE_URL_API_BACK

    const [sucursalSeleccionada] = useState<number | null>(2);
    const [searchTerm, setSearchTerm] = useState("");
    const [articulosManufacturados, setArticulosManufacturados] = useState<IArticuloManufacturado[]>([]);
    const [categorias, setCategorias] = useState<ICategoria[]>([]);
    const [, setFiltrarPorCategoria] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<ICategoria | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [manufacturadoToDelete, setInsumoToDelete] = useState<IArticuloManufacturado | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const itemsPerPage = 10 // Número de elementos por página

    const cargarTodosLosDatos = useCallback(async (idSucursal: number) => {
        const allData: IArticuloManufacturado[] = [];
        let page = 0;
    
        try {
            let hasMoreData = true;
            while (hasMoreData) {
                const result = new ArticuloManufacturadoService(
                    `${apiUrl}articulosManufacturados/porSucursal/${idSucursal}?page=${page}&size=20`
                );
                const data = await result.getPaginatedManufacturados();
    
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
    
            setArticulosManufacturados(allData);
        } catch (error) {
            console.error("Error al cargar todos los datos:", error);
        }
    }, [apiUrl]); // `apiUrl` es una dependencia que puede cambiar
    
    useEffect(() => {
        if (sucursalSeleccionada) {
            cargarTodosLosDatos(sucursalSeleccionada);
            setCurrentPage(1);
        }
    }, [sucursalSeleccionada, cargarTodosLosDatos]);
    

    // Función para obtener categorías
    const obtenerCategorias = useCallback(async () => {
        try {
            const result = new ArticuloManufacturadoService(apiUrl);
            const data = await result.getCategorias();
    
            // Filtrar las categorías que no son insumos
            setCategorias(data.filter((categoria: ICategoria) => !categoria.esInsumo));
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    }, [apiUrl]);

    const limpiarFiltro = () => {
        setCategoriaSeleccionada(null);
    };

    const filteredManufacturados = articulosManufacturados.filter((manufacturado) => {
        //console.log(`insumo:`, JSON.stringify(manufacturado, null, 2));
        // Verificar si la categoría seleccionada es válida
        const categoriaSeleccionadaObj = categorias.find(categoria => categoria.id === categoriaSeleccionada?.id);
    
        // Verificar el valor de categoriaSeleccionadaObj
    
        // Si la categoría seleccionada es nula, mostramos todos los manufacturados
        if (!categoriaSeleccionada) {
            return manufacturado.denominacion.toLowerCase().includes(searchTerm.toLowerCase());
        }
    
        // Si la categoría seleccionada es una categoría padre, incluir sus subcategorías
        const perteneceACategoria = categoriaSeleccionadaObj?.categoriaPadre === null
    ? manufacturado.categoria?.id === categoriaSeleccionadaObj.id || 
      categorias.some(c => c.categoriaPadre?.id === categoriaSeleccionadaObj.id && manufacturado.categoria?.id === c.id)
    : manufacturado.categoria?.id === categoriaSeleccionadaObj?.id;
    
        // Filtrar manufacturados por denominación y por categoría
        return manufacturado.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) && perteneceACategoria;
    });

    const paginatedManufacturados = filteredManufacturados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const confirmDelete = async () => {
        if (manufacturadoToDelete) {
            try {
                const result = new ArticuloManufacturadoService(apiUrl);
                await result.deleteInsumo(manufacturadoToDelete.id); // Assuming you have a deleteInsumo method in your service
                // After successful deletion, update the state to remove the deleted insumo
                setArticulosManufacturados(articulosManufacturados.filter(manufacturado => manufacturado.id !== manufacturadoToDelete.id));
                alert("Insumo eliminado con éxito."); // Or a better notification system
            } catch (error) {
                console.error("Error al eliminar articulo:", error);
                alert("Error al eliminar el articulo. Inténtelo nuevamente."); // Or a better error handling
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

    const handleFiltrarPorCategoria = () => {
        setFiltrarPorCategoria(true);
    };

    const handleDelete = (id:number) => {
        const manufacturado = articulosManufacturados.find(manufacturado => manufacturado.id === id);
        if (manufacturado) {
            setInsumoToDelete(manufacturado);
            setShowDeleteConfirmation(true);
        }
    }

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

    const handleCloseFilterModal = () => setShowFilterModal(false);
    const handleShowFilterModal = () => setShowFilterModal(true);

    // const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    //     setInputValue(event.target.value);
    // };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (sucursalSeleccionada) {
            cargarTodosLosDatos(sucursalSeleccionada);
            setCurrentPage(1); // Reinicia la página al cambiar de sucursal
        }
    }, [sucursalSeleccionada, cargarTodosLosDatos]);

    useEffect(() => {
        if (categoriaSeleccionada !== null) {
            setFiltrarPorCategoria(true);
        }
    }, [categoriaSeleccionada]);

    useEffect(() => {
        // obtenerSucursales();
        obtenerCategorias();
    }, [obtenerCategorias]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= Math.ceil(filteredManufacturados.length / itemsPerPage)) {
            setCurrentPage(newPage);
        }
    };

    return (
        <Container>
            <Row className="my-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <h1>Artículos</h1>
                    <Link to={'/panel-usuario/articulos/save/0'} className='btn btn-primary'>
                        <img src={masObject} alt="Crear Artículo" style={{ marginRight: '8px' }} />
                        Crear Artículo
                    </Link>
                </Col>
            </Row>

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
                        placeholder="Buscar articulo..."
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

            <GrillaGenerica data={paginatedManufacturados} propertiesToShow={["imagenes","denominacion","descripcion","precioVenta"]} editItem={`/panel-usuario/articulos/save/`} deleteFunction={handleDelete}></GrillaGenerica>

            {/* Confirmation Modal */}
                {showDeleteConfirmation && manufacturadoToDelete && (
                    <div className="modal show" style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">                                                             <h5 className="modal-title">Confirmar Eliminación</h5>
                                    <button type="button" className="btn-close" onClick={cancelDelete}></button>
                                </div>
                                <div className="modal-body">
                                    ¿Está seguro de que desea eliminar el insumo <strong>{manufacturadoToDelete.denominacion}</strong>?
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
                {filteredManufacturados.length > itemsPerPage && (
                    <div className="pagination d-flex justify-content-between align-items-center mt-3">
                        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Anterior
                        </Button>
                            <span>{`Página ${currentPage} de ${Math.ceil(filteredManufacturados.length / itemsPerPage)}`}</span>
                        <Button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredManufacturados.length / itemsPerPage)}
                            >
                                Siguiente
                            </Button>
                    </div>
                )}
        </Container>
    );
}