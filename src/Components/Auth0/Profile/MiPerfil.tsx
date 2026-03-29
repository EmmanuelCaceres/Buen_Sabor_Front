import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useRef } from "react";
import ICliente from "../../../Entities/ICliente";
import { Form, Button, Card, Row, Col, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import IProvincia from "../../../Entities/IProvincia";
import ILocalidad from "../../../Entities/ILocalidad";
import IDomicilio from "../../../Entities/IDomicilio";
import MisPedidos from "./MisPedidos";

const MiPerfil = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [cliente, setCliente] = useState<ICliente | null>(null);
  const [editandoCampo, setEditandoCampo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const apiUrl = import.meta.env.VITE_URL_API_BACK;
  const [showModalDomicilio, setShowModalDomicilio] = useState(false);
  const [nuevaDireccion, setNuevaDireccion] = useState<Partial<IDomicilio>>({
    calle: "",
    numero: 0,
    cp: 0,
    piso: 0,
    nroDpto: 0,
    baja: false,
  });
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
  const [provinciaId, setProvinciaId] = useState<number>(0);

  useEffect(() => {
    const fetchProvincias = async () => {
      const res = await fetch(`${apiUrl}provincias`);
      if (res.ok) setProvincias(await res.json());
    };
    fetchProvincias();
  }, [apiUrl]);

  // Cargar Localidades cuando cambie la provincia
  useEffect(() => {
    console.log("Provincia seleccionada ID:", provinciaId); // Debugging
    if (provinciaId > 0) {
      const fetchLocalidades = async () => {
        const res = await fetch(
          `${apiUrl}localidades/findByProvincia/${provinciaId}`, // Cambié porProvincia por findByProvincia
        );
        const data = await res.json();
        console.log("Localidades recibidas:", data); // Debugging
        if (res.ok) setLocalidades(data);
      };
      fetchLocalidades();
    } else {
      setLocalidades([]); // Limpia si no hay provincia
    }
  }, [provinciaId, apiUrl]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(
          `${apiUrl}clientes/findByEmail?email=${encodeURIComponent(user?.email || "")}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) setCliente(await res.json());
        console.log("Lo que llega de la API:", cliente);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    if (user?.email) cargarDatos();
  }, [user, getAccessTokenSilently, apiUrl]);

  const handleSave = async () => {
    if (!cliente || !user?.email) return;
    try {
      const token = await getAccessTokenSilently();

      // Usamos el endpoint personalizado por email
      const response = await fetch(
        `${apiUrl}clientes/update-perfil-by-email/${user.email}`,
        {
          method: "PUT", // O POST, según cómo lo tengas en el Controller (veo @PutMapping)
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cliente),
        },
      );

      if (response.ok) {
        setEditandoCampo(null);
        Swal.fire({
          title: "¡Actualizado!",
          text: "Tus datos se guardaron en la base de datos de Mendoza.",
          icon: "success",
          confirmButtonColor: "#FF9F00",
        });
      } else {
        const errorText = await response.text();
        console.error("Respuesta del servidor:", errorText);
        Swal.fire("Error", "No se pudo actualizar: " + errorText, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && cliente) {
      const file = e.target.files[0];
      const formData = new FormData();

      // 1. IMPORTANTE: Cambiamos "file" por "uploads" para que coincida con tu @RequestParam
      formData.append("uploads", file);

      try {
        const token = await getAccessTokenSilently();

        // 2. Usamos la URL correcta con el ID del cliente
        const res = await fetch(
          `${apiUrl}imagenesPersona/uploads/${cliente.id}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData, // No ponemos Content-Type, el navegador lo hace solo con FormData
          },
        );

        if (res.ok) {
          // Ya no necesitamos actualizar el estado manualmente porque el F5 lo hará
          Swal.fire({
            title: "¡Foto actualizada!",
            text: "Se guardaron los cambios correctamente.",
            icon: "success",
            confirmButtonColor: "#FF9F00",
            confirmButtonText: "Aceptar",
          }).then((result) => {
            // Cuando el usuario toca el botón 'Aceptar' o cierra el modal
            if (result.isConfirmed || result.isDismissed) {
              window.location.reload(); // Esto es el F5 por código
            }
          });
        } else {
          console.error("Error en la subida. Status:", res.status);
          Swal.fire("Error", "El servidor no aceptó la imagen", "error");
        }
      } catch (error) {
        console.error("Error de red:", error);
        Swal.fire("Error", "Error al conectar con el servidor", "error");
      }
    }
  };

  // Esta función es la que dispara el input oculto
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleAddDomicilio = async () => {
    if (!cliente) return;
    try {
      const token = await getAccessTokenSilently();

      // 1. Creamos el objeto del nuevo domicilio (SIN HACER POST TODAVÍA)
      // Importante: No le ponemos ID porque el backend se lo asignará
      const domicilioParaAgregar = {
        ...nuevaDireccion,
        baja: false,
      };

      // 2. Preparamos el cliente actualizado con la nueva dirección en la lista
      const clienteActualizado = {
        ...cliente,
        domicilios: [...cliente.domicilios, domicilioParaAgregar],
      };

      // 3. Hacemos UNA SOLA petición al endpoint que ya tenés para actualizar perfil
      const resCliente = await fetch(
        `${apiUrl}clientes/update-perfil-by-email/${user?.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(clienteActualizado),
        },
      );

      if (resCliente.ok) {
        const clienteDesdeServer = await resCliente.json();
        setCliente(clienteDesdeServer); // Actualizamos con lo que devuelve el server (ya con IDs)
        setShowModalDomicilio(false);
        Swal.fire("¡Éxito!", "Dirección agregada correctamente", "success");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire("Error", "No se pudo agregar la dirección", "error");
    }
  };

  const handleRemoveDomicilio = async (domicilioId: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar dirección?",
      text: "Esta acción quitará el domicilio de tu perfil.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF9F00",
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed && cliente) {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${apiUrl}clientes/${cliente.id}/removeDomicilio/${domicilioId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          // Actualizamos el estado filtrando el domicilio eliminado
          setCliente({
            ...cliente,
            domicilios: cliente.domicilios.filter((d) => d.id !== domicilioId),
          });
          Swal.fire("Eliminado", "La dirección fue quitada.", "success");
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la dirección", "error");
      }
    }
  };

  if (!cliente)
    return <div className="text-center mt-5">Cargando perfil...</div>;

  return (
    <div
      className="container mt-5"
      style={{ fontFamily: "Raleway, sans-serif" }}
    >
      <Row>
        <Col md={4}>
          <Card className="shadow-sm mb-4 border-0 text-center p-3">
            <div className="position-relative d-inline-block mx-auto">
              <img
                src={cliente.imagenPersona?.url || user?.picture}
                alt="Perfil"
                className="rounded-circle mb-3 border"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              {/* El botón de la cámara ahora dispara el triggerFileSelect */}
              <Button
                onClick={triggerFileSelect}
                variant="light"
                size="sm"
                className="position-absolute bottom-0 end-0 rounded-circle shadow"
              >
                <i className="fas fa-camera"></i>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <h4 className="mt-2">
              {cliente.nombre} {cliente.apellido}
            </h4>
            <p className="text-muted small">{cliente.usuario?.email}</p>
          </Card>

          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Mis Direcciones</h5>
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => setShowModalDomicilio(true)}
              >
                <i className="fas fa-plus me-2"></i>Nueva Dirección
              </Button>
            </div>

            {cliente?.domicilios && cliente.domicilios.length > 0 ? (
              cliente.domicilios.map((dom, index) => (
                <div
                  key={index}
                  className="p-3 border rounded mb-2 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>
                      {dom.calle} {dom.numero}
                    </strong>
                    <div className="text-muted small">
                      {dom.localidad.nombre} - CP: {dom.cp}
                      {dom.piso
                        ? ` - Piso: ${dom.piso} Dpto: ${dom.nroDpto}`
                        : ""}
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="text-danger"
                    onClick={() => handleRemoveDomicilio(dom.id!)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted italic">
                No tenés direcciones cargadas.
              </p>
            )}
          </div>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Mis Datos</h5>
              {editandoCampo && (
                <Button
                  variant="primary"
                  size="sm"
                  style={{ backgroundColor: "#FF9F00", border: "none" }}
                  onClick={handleSave}
                >
                  Guardar Cambios
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <Form>
                {/* NOMBRE */}
                <Form.Group as={Row} className="mb-4 align-items-center">
                  <Form.Label column sm="3" className="text-muted">
                    Nombre
                  </Form.Label>
                  <Col sm="7">
                    {editandoCampo === "nombre" ? (
                      <Form.Control
                        type="text"
                        value={cliente.nombre}
                        onChange={(e) =>
                          setCliente({ ...cliente, nombre: e.target.value })
                        }
                      />
                    ) : (
                      <div className="py-2 border-bottom">{cliente.nombre}</div>
                    )}
                  </Col>
                  <Col sm="2" className="text-end">
                    <i
                      className="fas fa-pencil-alt text-muted"
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditandoCampo("nombre")}
                    ></i>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-4 align-items-center">
                  <Form.Label column sm="3" className="text-muted">
                    Apellido
                  </Form.Label>
                  <Col sm="7">
                    {editandoCampo === "apellido" ? (
                      <Form.Control
                        type="text"
                        value={cliente.apellido || ""}
                        onChange={(e) =>
                          setCliente({ ...cliente, apellido: e.target.value })
                        }
                      />
                    ) : (
                      <div className="py-2 border-bottom">
                        {cliente.apellido || "No cargado"}
                      </div>
                    )}
                  </Col>
                  <Col sm="2" className="text-end">
                    <i
                      className="fas fa-pencil-alt text-muted"
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditandoCampo("apellido")}
                    ></i>
                  </Col>
                </Form.Group>

                {/* TELÉFONO */}
                <Form.Group as={Row} className="mb-4 align-items-center">
                  <Form.Label column sm="3" className="text-muted">
                    Teléfono
                  </Form.Label>
                  <Col sm="7">
                    {editandoCampo === "telefono" ? (
                      <Form.Control
                        type="text"
                        value={cliente.telefono || ""}
                        onChange={(e) =>
                          setCliente({ ...cliente, telefono: e.target.value })
                        }
                      />
                    ) : (
                      <div className="py-2 border-bottom">
                        {cliente.telefono || "No cargado"}
                      </div>
                    )}
                  </Col>
                  <Col sm="2" className="text-end">
                    <i
                      className="fas fa-pencil-alt text-muted"
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditandoCampo("telefono")}
                    ></i>
                  </Col>
                </Form.Group>

                {/* FECHA NACIMIENTO */}
                <Form.Group as={Row} className="mb-4 align-items-center">
                  <Form.Label column sm="3" className="text-muted">
                    Fecha Nacimiento
                  </Form.Label>
                  <Col sm="7">
                    {editandoCampo === "fechaNacimiento" ? (
                      <Form.Control
                        type="date"
                        value={cliente.fechaNacimiento || ""}
                        onChange={(e) =>
                          setCliente({
                            ...cliente,
                            fechaNacimiento: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="py-2 border-bottom">
                        {cliente.fechaNacimiento || "No cargada"}
                      </div>
                    )}
                  </Col>
                  <Col sm="2" className="text-end">
                    <i
                      className="fas fa-pencil-alt text-muted"
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditandoCampo("fechaNacimiento")}
                    ></i>
                  </Col>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          <MisPedidos clienteId={cliente.id} />
        </Col>
      </Row>
      <Modal
        show={showModalDomicilio}
        onHide={() => setShowModalDomicilio(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nueva Dirección en Buen Sabor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* SELECT DE PROVINCIA */}
            <Form.Group className="mb-3">
              <Form.Label>Provincia</Form.Label>
              <Form.Select
                onChange={(e) => setProvinciaId(parseInt(e.target.value))}
              >
                <option value="0">Seleccioná una provincia</option>
                {provincias.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* SELECT DE LOCALIDAD */}
            <Form.Group className="mb-3">
              <Form.Label>Localidad</Form.Label>
              <Form.Select
                disabled={provinciaId === 0}
                value={nuevaDireccion.localidad?.id || "0"} // Agregá esto para controlar el componente
                onChange={(e) =>
                  setNuevaDireccion({
                    ...nuevaDireccion,
                    localidad: { id: parseInt(e.target.value) } as ILocalidad,
                  })
                }
              >
                <option value="0">Seleccioná una localidad</option>
                {localidades.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Calle</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) =>
                  setNuevaDireccion({
                    ...nuevaDireccion,
                    calle: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="number"
                    onChange={(e) =>
                      setNuevaDireccion({
                        ...nuevaDireccion,
                        numero: parseInt(e.target.value),
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>CP</Form.Label>
                  <Form.Control
                    type="number"
                    onChange={(e) =>
                      setNuevaDireccion({
                        ...nuevaDireccion,
                        cp: parseInt(e.target.value),
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalDomicilio(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="warning"
            onClick={handleAddDomicilio}
            disabled={!nuevaDireccion.localidad?.id}
          >
            Guardar Dirección
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MiPerfil;
