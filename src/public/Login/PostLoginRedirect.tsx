import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRol } from "../../context/RolContext";
import { useSucursal } from "../../context/SucursalContext"; // 👈 1. IMPORTAMOS EL CONTEXTO DE SUCURSAL

const PostLoginRedirect = () => {
  const { user, isAuthenticated, getAccessTokenSilently, isLoading } =
    useAuth0();
  const navigate = useNavigate();
  const { setRol } = useRol();
  const { setSucursal } = useSucursal(); // 👈 2. TRAEMOS LA FUNCIÓN PARA SETEAR LA SUCURSAL
  const apiUrl = import.meta.env.VITE_URL_API_BACK;
  const effectRan = useRef(false);

  useEffect(() => {
    const checkUser = async () => {
      if (isLoading) return;
      if (!isAuthenticated || !user) {
        navigate("/");
        return;
      }
      if (effectRan.current) return;
      effectRan.current = true;

      try {
        const token = await getAccessTokenSilently();

        // Registrar/verificar usuario en base de datos
        const regResponse = await fetch(
          `${apiUrl}usuarios/registerIfNotExists`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: user.email,
              auth0Id: user.sub,
              nombre: user.given_name || user.nickname || user.name,
              apellido: user.family_name || "",
              rol: "CLIENTE",
            }),
          },
        );

        if (!regResponse.ok) throw new Error("Error al registrar usuario");

        // Traemos datos del usuario para decidir navegación y capturar ROL y SUCURSAL
        const res = await fetch(
          `${apiUrl}clientes/findByEmail?email=${encodeURIComponent(user.email!)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (res.ok) {
          const cliente = await res.json();

          console.log("--- DATOS QUE VIENEN DEL BACKEND ---");
          console.log("Objeto completo:", cliente);
          console.log("------------------------------------");

          const rolAsignado = cliente.usuario?.rol || cliente.rol || "CLIENTE";
          setRol(rolAsignado);

          // 🔒 REGLA DE NEGOCIO PARA ROLES DE EMPLEADOS
          const rolesOperativos = ["SUPERADMIN", "ADMIN", "CAJERO", "COCINERO", "DELIVERY"];
          
          if (rolesOperativos.includes(rolAsignado)) {
            
            // 3. BUSCAMOS LA SUCURSAL EN EL JSON QUE MANDÓ JAVA
            // Basado en tus entidades Empleado/Persona, puede venir dentro de cliente.sucursal o cliente.empleado.sucursal
            const sucursalEmpleado = cliente.sucursal || cliente.empleado?.sucursal || cliente.usuario?.empleado?.sucursal;

            if (sucursalEmpleado && sucursalEmpleado.id) {
              console.log(`🏢 Sucursal asignada al empleado: ${sucursalEmpleado.nombre} (ID: ${sucursalEmpleado.id})`);
              // Al llamar a setSucursal, se guarda en RAM y en el localStorage. ¡Chao amnesia al F5!
              setSucursal(sucursalEmpleado.id, sucursalEmpleado.nombre);
            } else {
              console.warn("⚠️ El empleado logueado no tiene una sucursal vinculada en la base de datos.");
            }

            navigate("/panel-usuario");
            return;
          }

          // Flujo común para clientes normales de Mendoza
          if (!cliente.telefono || !cliente.fechaNacimiento) {
            navigate("/completar-perfil");
          } else {
            navigate("/");
          }
        } else {
          navigate("/completar-perfil");
        }
      } catch (error) {
        console.error("Error crítico en el flujo de Post-Login:", error);
        navigate("/");
      }
    };

    checkUser();
  }, [
    isLoading,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    navigate,
    apiUrl,
    setRol,
    setSucursal, // 👈 4. AGREGAMOS AL ARRAY DE DEPENDENCIAS
  ]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Cargando...</span>
      </div>
      <h4 className="mt-4">Sincronizando tu cuenta y sucursal...</h4>
    </div>
  );
};

export default PostLoginRedirect;