import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import arrow_left from "../assets/arrow-circle-left-svgrepo-com.svg";
import IUsuario from "../Entities/IUsuario";
import IRol from "../Entities/IRol";
import UsuarioService from "../Functions/Services/UsuarioService";

export default function SaveRol() {
    const apiUrl = import.meta.env.VITE_URL_API_BACK;
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado inicial limpio adaptado a tu interfaz IUsuario
    const [usuario, setUsuario] = useState<IUsuario>({
        id: 0,
        baja: false,
        auth0Id: "",
        username: "",
        email: "",
        rol: undefined
    });

    // Función para obtener los detalles del usuario según el ID de la URL
    const getUsuarioById = async (baseUrl: string, usuarioId: number) => {
        // Le pegamos al endpoint raíz /usuarios/ que hereda los métodos CRUD
        const service = new UsuarioService(`${baseUrl}usuarios`);
        try {
            const data = await service.get(usuarioId);
            if (data !== null) {
                setUsuario(data);
                console.log("Usuario cargado: " + JSON.stringify(data, null, 2));
            } else {
                console.log("El usuario no se encontró.");
            }
        } catch (error) {
            console.error("Error al traer el usuario:", error);
        }
    };

    // Función encargada de persistir el cambio en el Backend
    const handleSaveUsuario = async () => {
        try {
            const service = new UsuarioService(`${apiUrl}usuarios`);
            
            if (Number(id) !== 0) {
                // Modificación usando el PUT genérico de tu arquitectura
                await service.put(Number(id), usuario);
                alert("¡Rol de usuario actualizado con éxito!");
            } else {
                // Por si en algún momento permitís creación manual desde acá
                await service.post(usuario);
                alert("¡Usuario creado con éxito!");
            }
            navigate(-1); // Regresa a la Grilla de Roles
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
            alert("Ocurrió un error al intentar guardar los cambios.");
        }
    };

    useEffect(() => {
        if (Number(id) !== 0) {
            getUsuarioById(apiUrl, Number(id));
        }
    }, [id, apiUrl]);

    return (
        <div className="container mt-4">
            {/* Botón Volver */}
            <Link to="/panel-usuario/roles" className="btnVolver d-flex align-items-center gap-2 mb-4 text-decoration-none text-dark">
                <img width={24} height={24} src={arrow_left} alt="arrow_left" />
                <p style={{ margin: "0" }}>Volver a la lista</p>
            </Link>

            <h2 className="mb-4">Modificar Rol de Usuario</h2>

            <form className="formContainer bg-light p-4 rounded border shadow-sm" onSubmit={(e) => e.preventDefault()}>
                
                {/* Campo de lectura para el Nombre de Usuario */}
                <div className="mb-3">
                    <label className="form-label font-weight-bold" htmlFor="username">Nombre de Usuario</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={usuario.username || "No asignado"}
                        disabled // Deshabilitado porque solo gestionamos el rol
                    />
                </div>

                {/* Campo de lectura para el Email */}
                <div className="mb-3">
                    <label className="form-label" htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={usuario.email}
                        disabled
                    />
                </div>

                {/* Combo dinámico para alterar el Rol basado en tu Enum IRol */}
                <div className="mb-4">
                    <label className="form-label" htmlFor="rol">Rol Asignado:</label>
                    <select
                        id="rol"
                        className="form-select"
                        style={{ maxWidth: "350px" }}
                        value={usuario.rol || ""}
                        onChange={(e) => setUsuario({ ...usuario, rol: e.target.value as IRol })}
                    >
                        <option value="" disabled>Selecciona un rol administrativo</option>
                        {Object.values(IRol).map((rolItem) => (
                            <option key={rolItem} value={rolItem}>
                                {rolItem}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botón de Guardado */}
                <button type="button" className="btn btn-primary px-4" onClick={handleSaveUsuario}>
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
}