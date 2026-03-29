import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import IImagenPersona from "../../Entities/IImagenPersona";
import IUsuario from "../../Entities/IUsuario";
import IRol from "../../Entities/IRol";
import IProvincia from "../../Entities/IProvincia"; // Ajustá la ruta según tu carpeta
import ILocalidad from "../../Entities/ILocalidad";

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
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");

  const [persona, setPersona] = useState<PersonaData>({
    nombre: "",
    apellido: "",
    telefono: "",
    fechaNac: "",
    imagenPersona: { id: 0, baja: false, name: "", url: "" },
    usuario: { 
        email: user?.email || "", 
        username: user?.nickname || "", // Usamos el nickname de Auth0 por defecto
        rol: IRol.CLIENTE 
    },
  });

  const [domicilio, setDomicilio] = useState({
    calle: "",
    numero: 0,
    cp: 0,
    piso: 0,      // Agregados para coincidir con tu DomicilioDto
    nroDpto: 0,   // Agregados para coincidir con tu DomicilioDto
    localidad: { id: 0 } as ILocalidad 
});

  // Cargar Provincias
  useEffect(() => {
    fetch(`${apiUrl}provincias`)
      .then(res => res.json())
      .then(data => setProvincias(data))
      .catch(err => console.error("Error cargando provincias:", err));
  }, [apiUrl]);

  // Cargar Localidades por Provincia
  useEffect(() => {
    if (provinciaSeleccionada) {
      fetch(`${apiUrl}localidades/findByProvincia/${provinciaSeleccionada}`)
        .then(res => res.json())
        .then(data => setLocalidades(data))
        .catch(err => console.error("Error cargando localidades:", err));
    }
  }, [provinciaSeleccionada, apiUrl]);

  // Precargar datos de Auth0
  useEffect(() => {
    if (isAuthenticated && user) {
      setPersona((prev) => ({
        ...prev,
        nombre: user.given_name || "",
        apellido: user.family_name || "",
        usuario: { ...prev.usuario, email: user.email || "" },
      }));
    }
  }, [isAuthenticated, user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagenFile(e.target.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersona((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let imagenUrl = persona.imagenPersona.url;

      // 1. Subida a Cloudinary (Preset Unsigned)
      if (imagenFile) {
        const data = new FormData();
        data.append("file", imagenFile);
        data.append("upload_preset", "buensabor_preset"); 

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/docf3ycuf/image/upload`,
          { method: "POST", body: data }
        );
        const cloudData = await cloudRes.json();
        imagenUrl = cloudData.secure_url;
      }

      const token = await getAccessTokenSilently();

      // 2. Armar el objeto final para el Back (incluyendo lista de domicilios)
      const payload = {
    nombre: persona.nombre,
    apellido: persona.apellido,
    telefono: persona.telefono,
    fechaNacimiento: persona.fechaNac,
    // Agregamos esto para que el back reciba el username
    usuario: {
        email: user?.email,
        username: persona.nombre + persona.apellido, // O un campo de input para username
    },
    imagenPersona: { 
        url: imagenUrl, 
        name: imagenFile?.name || "perfil", 
        baja: false 
    },
    domicilios: [domicilio] 
};

      const response = await fetch(`${apiUrl}clientes/update-perfil-by-email/${user?.email}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/"); 
      } else {
        const errorText = await response.text();
        console.error("Error en el back:", errorText);
        alert("Error al guardar el perfil: " + errorText);
      }
    } catch (err) {
      console.error("Error al completar perfil:", err);
    }
  };

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Finalizá tu registro</h2>
      <p className="text-muted">Necesitamos unos datos extra para tus pedidos en Mendoza.</p>
      
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        {/* Datos Personales */}
        <div className="row">
          <div className="col">
            <label className="form-label">Nombre</label>
            <input className="form-control" name="nombre" value={persona.nombre} onChange={handleChange} required />
          </div>
          <div className="col">
            <label className="form-label">Apellido</label>
            <input className="form-control" name="apellido" value={persona.apellido} onChange={handleChange} required />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label className="form-label">Teléfono</label>
            <input className="form-control" name="telefono" value={persona.telefono} onChange={handleChange} placeholder="261..." required />
          </div>
          <div className="col">
            <label className="form-label">Fecha de Nacimiento</label>
            <input className="form-control" type="date" name="fechaNac" value={persona.fechaNac} onChange={handleChange} required />
          </div>
        </div>

        {/* Domicilio */}
        <hr />
        <h4>Dirección de entrega</h4>
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">Provincia</label>
            <select className="form-select" required onChange={(e) => setProvinciaSeleccionada(e.target.value)}>
              <option value="">Seleccione Provincia</option>
              {provincias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Localidad</label>
            <select className="form-select" required onChange={(e) => setDomicilio({...domicilio, localidad: {id: Number(e.target.value)}})}>
              <option value="">Seleccione Localidad</option>
              {localidades.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label">Calle</label>
            <input className="form-control" required onChange={(e) => setDomicilio({...domicilio, calle: e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Número</label>
            <input className="form-control" type="number" required onChange={(e) => setDomicilio({...domicilio, numero: Number(e.target.value)})} />
          </div>
          <div className="col-md-3">
            <label className="form-label">CP</label>
            <input className="form-control" type="number" required onChange={(e) => setDomicilio({...domicilio, cp: Number(e.target.value)})} />
          </div>
        </div>

        {/* Imagen */}
        <hr />
        <label className="form-label">Foto de perfil</label>
        <input className="form-control" type="file" accept="image/*" onChange={handleFileChange} />

        <button className="btn btn-primary mt-4 w-100" type="submit">Guardar Perfil</button>
      </form>
    </div>
  );
};

export default CompletarPerfil;