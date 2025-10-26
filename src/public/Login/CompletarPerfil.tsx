import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import IImagenPersona from "../../Entities/IImagenPersona";
import IUsuario from "../../Entities/IUsuario";
import IRol from "../../Entities/IRol";

interface PersonaData {
  nombre: string;
  apellido: string;
  telefono: string;
  fechaNac: string;
  imagenPersona: IImagenPersona;
  usuario: IUsuario;
}

const CompletarPerfil: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_URL_API_BACK;

  const [imagenFile, setImagenFile] = useState<File | null>(null);

  const [persona, setPersona] = useState<PersonaData>({
    nombre: "",
    apellido: "",
    telefono: "",
    fechaNac: "",
    imagenPersona: { id: 0, baja: false, name: "", url: "" },
    usuario: { email: "", rol: IRol.CLIENTE },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setPersona((prev) => ({
        ...prev,
        nombre: user.name || "",
        usuario: { ...prev.usuario, email: user.email || "" },
      }));
    }
  }, [isAuthenticated, user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImagenFile(file);
      setPersona((prev) => ({
        ...prev,
        imagenPersona: { ...prev.imagenPersona, name: file.name },
      }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("imagenPersona.")) {
      const field = name.split(".")[1];
      setPersona((prev) => ({
        ...prev,
        imagenPersona: { ...prev.imagenPersona, [field]: value },
      }));
    } else {
      setPersona((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let imagenUrl = persona.imagenPersona.url;

      if (imagenFile) {
        const data = new FormData();
        data.append("file", imagenFile);
        data.append("upload_preset", "TU_UPLOAD_PRESET");

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/TU_CLOUD_NAME/image/upload`,
          { method: "POST", body: data }
        );
        const cloudData = await cloudRes.json();
        imagenUrl = cloudData.secure_url;
      }

      const token = await getAccessTokenSilently();

      await fetch(`${apiUrl}personas/completar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: persona.nombre,
          apellido: persona.apellido,
          telefono: persona.telefono,
          fechaNacimiento: persona.fechaNac,
          imagenPersona: { url: imagenUrl, name: imagenFile?.name || persona.imagenPersona.name, baja: false },
        }),
      });

      navigate("/"); // redirigir al home
    } catch (err) {
      console.error("Error al completar perfil:", err);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Completar Perfil</h2>
      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <input name="nombre" value={persona.nombre} onChange={handleChange} required />

        {/* Apellido */}
        <input name="apellido" value={persona.apellido} onChange={handleChange} required />

        {/* Teléfono */}
        <input name="telefono" value={persona.telefono} onChange={handleChange} />

        {/* Fecha de nacimiento */}
        <input type="date" name="fechaNac" value={persona.fechaNac} onChange={handleChange} />

        {/* Email readonly */}
        <input name="usuario.email" value={persona.usuario.email} readOnly />

        {/* Imagen */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default CompletarPerfil;
