import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthRedirectHandler = () => {
  const { user, isAuthenticated, getAccessTokenSilently, isLoading } =
    useAuth0();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_URL_API_BACK;

  // LOG DE ESTADO PARA DEBUG (Mirá la consola del navegador F12)
  console.log("Auth Status:", {
    isLoading,
    isAuthenticated,
    email: user?.email,
  });

  useEffect(() => {
    // SALIDA DE EMERGENCIA: Si en 6 segundos no redirigió, algo falló con Auth0
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Auth0 demoró demasiado. Redirigiendo por timeout...");
        navigate("/");
      }
    }, 6000);

    const verificarYRedirigir = async () => {
      // 1. Esperamos a que Auth0 termine de cargar
      if (isLoading) return;

      // 2. Si terminó de cargar y NO está autenticado, al home
      if (!isAuthenticated) {
        console.log("No autenticado, redirigiendo a Home");
        navigate("/");
        return;
      }

      // 3. Si está autenticado pero no tenemos el mail todavía (raro)
      if (!user?.email) return;

      try {
        console.log("Iniciando sincronización con el Backend...");
        const token = await getAccessTokenSilently();

        // 1. Sincronizar/Registrar el usuario en el Backend
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
              username: user.nickname || user.name,
              nombre: user.given_name || user.name,
              apellido: user.family_name || "",
              rol: "CLIENTE",
              auth0Id: user.sub,
            }),
          },
        );

        // USAMOS regResponse: Si el servidor responde con error (que no sea 409 Conflict), frenamos.
        if (!regResponse.ok && regResponse.status !== 409) {
          const errorText = await regResponse.text();
          throw new Error(`Error en el registro: ${errorText}`);
        }

        console.log(
          "Registro verificado (Nuevo o Existente). Procediendo a buscar datos...",
        );

        // 2. Traer los datos del Cliente/Persona
        const clienteRes = await fetch(
          `${apiUrl}clientes/por-email/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (clienteRes.ok) {
          const clienteData = await clienteRes.json();
          // CHEQUEO CRÍTICO: Si no hay teléfono o fecha de nacimiento, completar perfil
          if (!clienteData.telefono || !clienteData.fechaNacimiento) {
            navigate("/completar-perfil");
          } else {
            navigate("/");
          }
        } else {
          navigate("/completar-perfil");
        }
      } catch (error) {
        console.error("Error en AuthRedirectHandler:", error);
        navigate("/");
      }
    };

    verificarYRedirigir();
    return () => clearTimeout(timeout);
  }, [isLoading, isAuthenticated, user, getAccessTokenSilently]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Sincronizando con El Buen Sabor...</p>
      </div>
    </div>
  );
};
