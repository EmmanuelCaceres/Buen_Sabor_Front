import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthRedirectHandler = () => {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_URL_API_BACK;

  useEffect(() => {
    const verificarPersona = async () => {
      if (isAuthenticated && user?.email) {
        try {
          // Registrar usuario si no existe
          await axios.post(`${apiUrl}usuarios/registerIfNotExists`, {
            email: user.email,
            username: user.nickname || user.name,
            nombre: user.given_name || user.name,
            apellido: user.family_name || "",
            rol: "CLIENTE",
            auth0Id: user.sub,
          });

          // Consultar persona
          const res = await axios.get(`${apiUrl}personas/exists`, {
            params: { email: user.email },
          });

          const personaExiste = res.data;
          if (!personaExiste) {
            navigate("/completar-perfil");
          }
        } catch (err) {
          console.error("Error verificando la persona:", err);
          navigate("/completar-perfil");
        }
      }
    };

    verificarPersona();
  }, [isAuthenticated, user, navigate, apiUrl]);

  return null;
};
