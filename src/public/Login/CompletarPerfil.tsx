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

  const [imagenFile, setImagenFile] = useState<File | null>(null);

  const [persona, setPersona] = useState<PersonaData>({
    nombre: "",
    apellido: "",
    telefono: "",
    fechaNac: "",
    imagenPersona: {
      id: 0,
      baja: false,
      name: "",
      url: "",
    },
    usuario: {
      email: "",
      rol: IRol.CLIENTE,
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setPersona((prev) => ({
        ...prev,
        nombre: user.name || "",
        usuario: {
          ...prev.usuario,
          email: user.email || "",
        },
      }));
    }
  }, [isAuthenticated, user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImagenFile(file);
      setPersona((prev) => ({
        ...prev,
        imagenPersona: {
          ...prev.imagenPersona,
          name: file.name,
        },
      }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("imagenPersona.")) {
      const field = name.split(".")[1];
      setPersona((prev) => ({
        ...prev,
        imagenPersona: {
          ...prev.imagenPersona,
          [field]: value,
        },
      }));
    } else if (name.startsWith("usuario.")) {
      const field = name.split(".")[1];
      setPersona((prev) => ({
        ...prev,
        usuario: {
          ...prev.usuario,
          [field]: value,
        },
      }));
    } else {
      setPersona((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPersona((prev) => ({
      ...prev,
      fechaNac: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();

      const formData = new FormData();
      formData.append("nombre", persona.nombre);
      formData.append("apellido", persona.apellido);
      formData.append("telefono", persona.telefono);
      formData.append("fechaNac", persona.fechaNac);
      formData.append("usuario.email", persona.usuario.email);
      formData.append("usuario.rol", persona.usuario.rol?.toString() || "");

      if (imagenFile) {
        formData.append("imagen", imagenFile);
      }

      const res = await fetch(
        `${import.meta.env.VITE_URL_API_BACK}personas`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        console.log("Datos guardados correctamente");
        navigate("/dashboard");
      } else {
        console.error("Error al guardar Persona");
      }
    } catch (err) {
      console.error("Error en el envío:", err);
    }
  };

  console.log({ isAuthenticated, user, persona });

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Completar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            value={persona.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Nombre"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="apellido" className="form-label">
            Apellido
          </label>
          <input
            id="apellido"
            name="apellido"
            value={persona.apellido}
            onChange={handleChange}
            className="form-control"
            placeholder="Apellido"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            value={persona.telefono}
            onChange={handleChange}
            className="form-control"
            placeholder="Teléfono"
            type="tel"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fechaNac" className="form-label">
            Fecha de Nacimiento
          </label>
          <input
            id="fechaNac"
            type="date"
            name="fechaNac"
            value={persona.fechaNac}
            onChange={handleDateChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="usuario.email" className="form-label">
            Email (desde Auth0)
          </label>
          <input
            id="usuario.email"
            name="usuario.email"
            value={persona.usuario.email}
            readOnly
            className="form-control-plaintext"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">
            Foto de perfil
          </label>
          <input
            id="imagen"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="imagenPersona.url" className="form-label">
            URL de la imagen
          </label>
          <input
            id="imagenPersona.url"
            name="imagenPersona.url"
            value={persona.imagenPersona.url}
            onChange={handleChange}
            className="form-control"
            placeholder="URL de la imagen"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default CompletarPerfil;
