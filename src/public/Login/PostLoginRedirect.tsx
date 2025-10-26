import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostLoginRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
  if (isLoading || !isAuthenticated || !user) return;

  const verificarPersona = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/personas/email`, {
        params: { email: user.email },
      });

      const data = res.data;

      if (!data.exists) {
        navigate("/completar-perfil");
      } else if (data.tipo === "CLIENTE") {
        navigate("/");
      } else if (data.tipo === "EMPLEADO") {
        navigate("/panel-usuario");
      } else {
        navigate("/"); // fallback
      }
    } catch (error) {
      console.error("Error al verificar persona:", error);
      navigate("/completar-perfil");
    }
  };

  verificarPersona();
}, [isAuthenticated, isLoading, user, navigate]);


  return <p>Cargando...</p>;
};

export default PostLoginRedirect;
