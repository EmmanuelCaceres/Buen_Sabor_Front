import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import masObject from "../../assets/circle-plus-svgrepo-com.svg";
import { Button, Table} from "react-bootstrap";
import IEmpleado from "../../Entities/IEmpleado";
import EmpleadoService from "../../Functions/Services/EmpleadoService";

export default function GrillaEmpleado() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;

    const [sucursalSeleccionada] = useState<number | null>(2);
    const [AllEmpleados,setAllEmpleados] = useState<IEmpleado[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [empleadoToDelete, setEmpleadoToDelete] = useState<IEmpleado | null>(null);

    const itemsPerPage = 15; // Número de elementos por página

    // Función para cargar todos los datos en un solo array
        const cargarTodosLosDatos = async (idSucursal: number) => {
            const allData: IEmpleado[] = [];
            let page = 0;
    
            try {
                let hasMoreData = true;
                while (hasMoreData) {
                    const result = new EmpleadoService(
                        `${apiUrl}empleados/porSucursal/${idSucursal}?page=${page}&size=20`
                    );
                    const data = await result.getPaginatedEmpleados();
    
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
    
                setAllEmpleados(allData);
            } catch (error) {
                console.error("Error al cargar todos los datos:", error);
            }
        };

        const paginatedEmpleados = AllEmpleados.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        const handleDelete = (empleado: IEmpleado) => {
            setEmpleadoToDelete(empleado);
            setShowDeleteConfirmation(true);
        };

        useEffect(() => {
            if (sucursalSeleccionada) {
                cargarTodosLosDatos(sucursalSeleccionada);
                setCurrentPage(1); // Reinicia la página al cambiar de sucursal
            }
        }, [sucursalSeleccionada]);

        const confirmDelete = async () => {
                if (empleadoToDelete) {
                    try {
                        const result = new EmpleadoService(apiUrl);
                        await result.deleteEmpleado(empleadoToDelete.id); // Assuming you have a deleteInsumo method in your service
                        // After successful deletion, update the state to remove the deleted insumo
                        setAllEmpleados(AllEmpleados.filter(empleado => empleado.id !== empleadoToDelete.id));
                        alert("Insumo eliminado con éxito."); // Or a better notification system
                    } catch (error) {
                        console.error("Error al eliminar insumo:", error);
                        alert("Error al eliminar el insumo. Inténtelo nuevamente."); // Or a better error handling
                    } finally {
                        setShowDeleteConfirmation(false);
                        setEmpleadoToDelete(null);
                    }
                }
            };
        
            const cancelDelete = () => {
                setShowDeleteConfirmation(false);
                setEmpleadoToDelete(null);
            };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center">
                <h1>Empleados</h1>
                <Link to={"save/0"} className="btn btn-primary">
                    <img src={masObject} alt="Crear Insumo" style={{ marginRight: "8px" }} />
                    Dar alta a nuevo empleado
                </Link>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th className="text-center align-middle">Imagen</th>
                        <th className="text-center align-middle">Apellido</th>
                        <th className="text-center align-middle">Nombre</th>
                        <th className="text-center align-middle">Email</th>
                        <th className="text-center align-middle">Rol</th>
                        <th className="text-center align-middle">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedEmpleados.length > 0 ? (
                        paginatedEmpleados.map((empleado) => (
                            <tr key={empleado.id}>
                                <td className="text-center align-middle">
                                    {empleado.imagen?.url ? (
                                        <img
                                            width={200}
                                            height={200}
                                            style={{ objectFit: "contain", maxWidth: "90px", maxHeight: "90px" }}
                                            src={`${empleado.imagen.url}`}
                                            alt="imagenArticulo"
                                        />
                                    ) : null}
                                </td>
                                <td className="text-center align-middle">{empleado.apellido}</td>
                                <td className="text-center align-middle">{empleado.nombre}</td>
                                <td className="text-center align-middle">{empleado.usuario.email}</td>
                                <td className="text-center align-middle">{empleado.usuario.rol}</td>
                                <td className="text-center align-middle">
                                    <Link to={"save/" + empleado.id} className="btn btn-warning me-2">
                                        Editar
                                    </Link>
                                    <Button variant="danger"onClick={() => handleDelete(empleado)}>
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

            {/* Confirmation Modal */}
            {showDeleteConfirmation && empleadoToDelete && (
                <div className="modal show" style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar Eliminación</h5>
                                <button type="button" className="btn-close" onClick={cancelDelete}></button>
                            </div>
                            <div className="modal-body">
                                ¿Está seguro de que desea eliminar el empleado <strong>{empleadoToDelete.apellido+" "+empleadoToDelete.nombre}</strong>?
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" onClick={cancelDelete}>Cancelar</Button>
                                <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    );
}

