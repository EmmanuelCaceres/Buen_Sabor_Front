import { useState, ChangeEvent, FormEvent } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import IImagenPersona from "../../Entities/IImagenPersona";
import IUsuario from "../../Entities/IUsuario";
import IRol from "../../Entities/IRol"; // 👈 Importamos la enumeración

interface PersonaData {
  nombre: string;
  apellido: string;
  telefono: string;
  fechaNac: string;
  imagenPersona: IImagenPersona;
  usuario: IUsuario;
}

interface CompletarPerfilProps {
  auth0User: {
    name?: string;
    email?: string;
  };
}

const CompletarPerfil: React.FC<CompletarPerfilProps> = ({ auth0User }) => {
  const [imagenFile, setImagenFile] = useState<File | null>(null);

  const [persona, setPersona] = useState<PersonaData>({
    nombre: auth0User?.name || "",
    apellido: "",
    telefono: "",
    fechaNac: "",
    imagenPersona: {
      id: 0,
      baja: false,
      name: "", // nombre de la imagen
      url: "",  // puedes dejarlo vacío inicialmente
    },
    usuario: {
      email: auth0User?.email || "",
      rol: IRol.CLIENTE, // 👈 Usamos el enum correctamente
    },
  });
  console.log("Renderizando CompletarPerfil", auth0User);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

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

    setPersona((prev) => {
      // Si estás modificando un campo anidado como imagenPersona.name
      if (name.startsWith("imagenPersona.")) {
        const field = name.split(".")[1];
        return {
          ...prev,
          imagenPersona: {
            ...prev.imagenPersona,
            [field]: value,
          },
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
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
        formData.append("imagen", imagenFile); // 👈 nombre según backend
      }

      const res = await fetch(`${import.meta.env.VITE_URL_API_BACK}personas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        console.log("Datos guardados");
        navigate("/dashboard");
      } else {
        console.error("Error al guardar Persona");
      }
    } catch (err) {
      console.error("Error en el envío:", err);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        value={persona.nombre}
        onChange={handleChange}
        placeholder="Nombre"
      />
      <input
        name="apellido"
        value={persona.apellido}
        onChange={handleChange}
        placeholder="Apellido"
      />
      <input
        name="telefono"
        value={persona.telefono}
        onChange={handleChange}
        placeholder="Teléfono"
      />
      <input
        type="date"
        name="fechaNac"
        value={persona.fechaNac}
        onChange={handleDateChange}
        placeholder="Fecha de Nacimiento"
      />
      <input
        name="usuario.email"
        value={persona.usuario.email}
        readOnly
        placeholder="Email (desde Auth0)"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <input
        name="imagenPersona.url"
        value={persona.imagenPersona.url}
        onChange={handleChange}
        placeholder="URL de la imagen"
      />
      <button type="submit">Guardar</button>
    </form>
  );
};

export default CompletarPerfil;
