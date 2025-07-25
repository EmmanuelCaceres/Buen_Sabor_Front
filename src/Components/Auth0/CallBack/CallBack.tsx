import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const CallBack = () => {
  const { isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !error) {
      navigate("/panel-usuario"); // Cambiá por la ruta que quieras
    }
  }, [isLoading, error, navigate]);

  if (error) {
    return <div>Ocurrió un error al iniciar sesión: {error.message}</div>;
  }

  return <div>Procesando autenticación...</div>; // Podés poner un spinner si querés
};
