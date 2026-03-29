import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PostLoginRedirect = () => {
  const { user, isAuthenticated, getAccessTokenSilently, isLoading } =
    useAuth0();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_URL_API_BACK;

  // El "ref" sobrevive a los re-renders y evita la doble ejecución en modo desarrollo
  const effectRan = useRef(false);

  useEffect(() => {
    const checkUser = async () => {
      // 1. Validaciones iniciales
      if (isLoading) return;
      if (!isAuthenticated || !user) {
        navigate("/");
        return;
      }

      // 2. Si ya se ejecutó este efecto, no hacemos nada (evita duplicados)
      if (effectRan.current) return;
      effectRan.current = true;

      try {
        const token = await getAccessTokenSilently();

        // 3. Paso 1: Registrar o verificar existencia del usuario en el Backend
        // Asegúrate de que este endpoint en el back use @Transactional y checkee existencia
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

        if (!regResponse.ok) {
          throw new Error("Error al registrar el usuario en el servidor");
        }

        // 4. Paso 2: Traemos los datos del cliente para decidir navegación
        // Usamos el email de Auth0 para buscarlo
        const res = await fetch(
          `${apiUrl}clientes/findByEmail?email=${encodeURIComponent(user.email!)}`, // Agregamos encodeURIComponent
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.ok) {
          const cliente = await res.json();

          // Lógica de decisión:
          // Si no tiene teléfono o fecha de nacimiento, lo mandamos a completar el perfil de Mendoza
          if (!cliente.telefono || !cliente.fechaNacimiento) {
            console.log(
              "Datos incompletos, redirigiendo a completar perfil...",
            );
            navigate("/completar-perfil");
          } else {
            console.log("Perfil completo, redirigiendo al home...");
            navigate("/");
          }
        } else {
          // Si el cliente no existe aún (a veces el insert del paso 3 demora ms),
          // mandamos a completar perfil por seguridad
          navigate("/completar-perfil");
        }
      } catch (error) {
        console.error("Error crítico en el flujo de Post-Login:", error);
        // Si algo falla, lo sacamos del loop de carga enviándolo al inicio
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
      <h4 className="mt-4">Sincronizando tu cuenta...</h4>
      <p className="text-muted">Estamos preparando todo para tu pedido.</p>
    </div>
  );
};

export default PostLoginRedirect;
