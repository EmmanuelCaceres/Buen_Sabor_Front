import { useState, useEffect } from "react";
import UsuarioService from "../../Functions/Services/UsuarioService"; // Ajustá tu ruta
import IUsuario from "../../Entities/IUsuario";
import IRol from "../../Entities/IRol";
import GrillaGenerica from "./GrillaGenerica";
import { Form, Container } from "react-bootstrap";

export default function GrillaRol() {
  const apiUrl = import.meta.env.VITE_URL_API_BACK;
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<IUsuario[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState<string>("");

  // Instanciamos tu servicio pasándole la URL correspondiente
  const usuarioService = new UsuarioService(
    `${apiUrl}usuarios?page=0&size=50`, // Traemos los primeros 50 usuarios para la grilla
  );

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        // 1. Cambiamos a true para activar la paginación que el backend genérico espera
        const data = await usuarioService.getAllUsuarios(true);

        // 2. Verificamos si la respuesta viene con la estructura paginada de Spring Boot (data.content)
        if (data && typeof data === "object" && "content" in data) {
          setUsuarios(data.content as IUsuario[]);
        } else if (Array.isArray(data)) {
          // Por si acaso tu GenericFetch ya resolvía el array directamente
          setUsuarios(data);
        }
      } catch (error) {
        console.error("Error al traer usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  // Filtramos la lista localmente cuando cambia el combo de selección
  useEffect(() => {
    let resultado = [...usuarios];
    if (rolSeleccionado !== "") {
      resultado = resultado.filter((u) => u.rol === rolSeleccionado);
    }
    setUsuariosFiltrados(resultado);
  }, [usuarios, rolSeleccionado]);

  return (
    <Container fluid className="mt-4">
      {/* ... Cabecera con el selector de Roles (Se mantiene igual) ... */}
      <Form.Select
        value={rolSeleccionado}
        onChange={(e) => setRolSeleccionado(e.target.value)}
      >
        <option value="">-- Todos los Roles --</option>
        {Object.values(IRol).map((rol) => (
          <option key={rol} value={rol}>
            {rol}
          </option>
        ))}
      </Form.Select>

      {/* Renderizado con tus propiedades reales de IUsuario */}
      <GrillaGenerica<Omit<IUsuario, "id"> & { id: number }>
        data={usuariosFiltrados as (Omit<IUsuario, "id"> & { id: number })[]}
        propertiesToShow={["username", "email", "rol"]}
        columnAliases={{
          username: "Nombre de Usuario",
          email: "Correo Electrónico",
          rol: "Rol Asignado",
        }}
        editItem="/panel-usuario/roles/save/"
      />
    </Container>
  );
}
