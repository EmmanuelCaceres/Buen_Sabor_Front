import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import EmpleadoService from "../Functions/Services/EmpleadoService";
import ISucursalDto from "../Entities/ISucursalDto";
import { useSucursal } from "../context/SucursalContext";

// Interfaz rápida para tipar los usuarios que traemos del back
interface UsuarioDisponible {
    id: number;
    email: string;
    rol: string;
}

export default function SaveEmpleado() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const { id } = useParams();
    const navigate = useNavigate();
    const { sucursalId } = useSucursal();

    const [sucursales, setSucursales] = useState<ISucursalDto[]>([]);
    const [usuariosDisponibles, setUsuariosDisponibles] = useState<UsuarioDisponible[]>([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    // Estado del formulario adaptado a tu DTO de Empleado
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        fechaNacimiento: new Date().toISOString().split("T")[0],
        email: "",
        rol: "COCINERO",
        sucursalId: sucursalId || 0
    });

    const rolesDisponibles = ["COCINERO", "CAJERO", "DELIVERY", "ADMIN"];

    useEffect(() => {
        const empleadoService = new EmpleadoService(`${apiUrl}empleados`);
        
        // 1. Cargar sucursales para el select
        empleadoService.getSucursales().then(data => {
            setSucursales(data);
            if (!formData.sucursalId && data.length > 0) {
                setFormData(prev => ({ ...prev, sucursalId: data[0].id }));
            }
        });

        // 2. Cargar usuarios de Auth0 para el autocompletado (solo si es alta nueva)
        if (!id || Number(id) === 0) {
            fetch(`${apiUrl}usuarios?page=0&size=100`)
                .then(res => res.json())
                .then(data => {
                    const items = Array.isArray(data) ? data : (data.content || []);
                    const soloClientes = items.filter((u: UsuarioDisponible) => u.rol === "CLIENTE");
                    setUsuariosDisponibles(soloClientes);
                })
                .catch(err => console.error("Error cargando usuarios:", err));
        }

        // 3. Si es edición de un empleado existente, cargamos sus datos
        if (id && Number(id) !== 0) {
            empleadoService.getById(Number(id)).then(emp => {
                if (emp) {
                    setFormData({
                        nombre: emp.nombre || "",
                        apellido: emp.apellido || "",
                        telefono: emp.telefono || "",
                        fechaNacimiento: emp.fechaNacimiento ? emp.fechaNacimiento.toString() : "",
                        email: emp.usuario?.email || "",
                        rol: emp.usuario?.rol || "COCINERO",
                        sucursalId: emp.sucursal?.id || sucursalId || 0
                    });
                }
            });
        }
    }, [id, apiUrl]);

    // Lógica que autocompleta el formulario al elegir un usuario del combo
    const handleSeleccionarUsuario = async (emailElegido: string) => {
        setUsuarioSeleccionado(emailElegido);
        if (!emailElegido) return;

        try {
            // Consultamos si este usuario tiene datos previos en la tabla Cliente para autocompletar
            const res = await fetch(`${apiUrl}clientes/findByEmail?email=${encodeURIComponent(emailElegido)}`);
            if (res.ok) {
                const cliente = await res.json();
                setFormData(prev => ({
                    ...prev,
                    nombre: cliente.nombre || prev.nombre,
                    apellido: cliente.apellido || prev.apellido,
                    telefono: cliente.telefono || prev.telefono,
                    fechaNacimiento: cliente.fechaNacimiento ? cliente.fechaNacimiento.toString() : prev.fechaNacimiento,
                    email: emailElegido
                }));
            } else {
                // Si no era cliente, al menos completamos el email
                setFormData(prev => ({ ...prev, email: emailElegido }));
            }
        } catch (error) {
            console.error("Error al autocompletar datos del cliente:", error);
            setFormData(prev => ({ ...prev, email: emailElegido }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const empleadoService = new EmpleadoService(`${apiUrl}empleados`);

        const payload = {
            id: id ? Number(id) : null,
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            fechaNacimiento: formData.fechaNacimiento,
            usuario: {
                email: formData.email,
                rol: formData.rol
            },
            sucursal: {
                id: Number(formData.sucursalId)
            }
        };

        const exito = await empleadoService.saveEmpleadoCompleto(payload, Number(id));
        setIsSaving(false);

        if (exito) {
            alert("¡Empleado guardado exitosamente!");
            navigate("/panel-usuario/empleados");
        } else {
            alert("Error al guardar. Verificá los datos o si el email ya pertenece a otro empleado.");
        }
    };

    return (
        <div className="container mt-4">
            {isSaving && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 9999 }}>
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }} />
                    <h4 className="text-primary fw-bold">Guardando empleado...</h4>
                </div>
            )}

            <Link to="/panel-usuario/empleados" className="btnVolver d-flex align-items-center gap-2 mb-4 text-decoration-none text-dark">
                <img width={24} height={24} src={arrow_left} alt="volver" />
                <p className="m-0">Volver a la lista</p>
            </Link>

            <h2 className="mb-4">{id && Number(id) !== 0 ? "Editar Empleado" : "Alta de Nuevo Empleado"}</h2>

            {/* COMBO DE AUTOCOMPLETADO (Solo visible al crear un empleado nuevo) */}
            {(!id || Number(id) === 0) && (
                <div className="alert alert-info shadow-sm mb-4">
                    <label className="form-label font-weight-bold mb-1">🔍 Vincular cuenta registrada (Autocompletar):</label>
                    <select 
                        className="form-select" 
                        value={usuarioSeleccionado} 
                        onChange={e => handleSeleccionarUsuario(e.target.value)}
                    >
                        <option value="">-- Seleccionar un usuario/cliente para contratar --</option>
                        {usuariosDisponibles.map(u => (
                            <option key={u.id} value={u.email}>
                                {u.email} ({u.rol || "Sin rol"})
                            </option>
                        ))}
                    </select>
                    <small className="text-muted">Al seleccionar una cuenta, los datos personales se cargarán automáticamente si el usuario ya completó su perfil.</small>
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-light">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label font-weight-bold">Nombre</label>
                        <input type="text" className="form-control" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label font-weight-bold">Apellido</label>
                        <input type="text" className="form-control" required value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label font-weight-bold">Teléfono</label>
                        <input type="text" className="form-control" required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label font-weight-bold">Fecha de Nacimiento</label>
                        <input type="date" className="form-control" required value={formData.fechaNacimiento} onChange={e => setFormData({...formData, fechaNacimiento: e.target.value})} />
                    </div>
                </div>

                <hr />
                <h5 className="mb-3 text-secondary">Datos Laborales y Acceso</h5>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label font-weight-bold">Email (Cuenta de Acceso)</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            required 
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            placeholder="ej: cocinero@elbuensabor.com"
                            readOnly={!!usuarioSeleccionado} // Se bloquea si se usó el autocompletado
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label font-weight-bold">Rol Asignado</label>
                        <select className="form-select" value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})}>
                            {rolesDisponibles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label font-weight-bold">Sucursal</label>
                        <select className="form-select" value={formData.sucursalId} onChange={e => setFormData({...formData, sucursalId: Number(e.target.value)})}>
                            {sucursales.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <button type="submit" className="btn btn-primary px-5">Guardar Empleado</button>
                </div>
            </form>
        </div>
    );
}