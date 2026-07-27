import { Route, Routes, Navigate } from "react-router-dom";
import { AuthenticationGuard, CallBack, Home } from "./Components";
import MiPerfil from "./Components/Auth0/Profile/MiPerfil";
import Root from "./Components/Root";
import GrillaArticulo from "./Components/Grillas/GrillaArticuloManufacturado";
import SaveArticulo from "./FormSave/SaveArticuloManufacturado";
import SaveInsumo from "./FormSave/SaveInsumo";
import SaveCategoria from "./FormSave/SaveCategoria";
import GrillaEmpleado from "./Components/Grillas/GrillaEmpleado";
import GrillaRol from "./Components/Grillas/GrillaRol";
import GrillaPromocion from "./Components/Grillas/GrillaPromocion";
import SavePromocion from "./FormSave/SavePromocion";
import GrillaInsumo from "./Components/Grillas/GrillaInsumo";
import GrillaCategoria from "./Components/Grillas/GrillaCategoria";
import SaveEmpleado from "./FormSave/SaveEmpleado";
import GrillaSucursal from "./Components/Grillas/GrillaSucursal";
import SaveSucursal from "./FormSave/SaveSucursal";
import Index from "./PublicLandings/Index";
import DescriptionPromotion from "./PublicLandings/DescriptionPromotion";
import Categories from "./PublicLandings/Categories";
import Promotions from "./PublicLandings/Promotions";
import CompletarPerfil from "./public/Login/CompletarPerfil";
import PostLoginRedirect from "./public/Login/PostLoginRedirect";
import Checkout from "./Components/Lado Cliente/CheckOut";
import MisPedidos from "./Components/Auth0/Profile/MisPedidos";
import { PagoConfirmado } from "./Components/Lado Cliente/PagoConfirmado";
import MonitorPedidos from "./Components/MonitorPedidos";
import GrillaUnidadMedida from "./Components/Grillas/GrillaUnidadMedida";
import SaveUnidadMedida from "./FormSave/SaveUnidadMedida";
import Inicio from "./Components/Inicio";
import HistorialPedidos from "./Components/HistorialPedidos";
import Clientes from "./Components/Clientes";
import { useRol } from "./context/RolContext"; // Ajustá la ruta
import SaveRol from "./FormSave/SaveRol";

// 🛡️ GUARDIA DE SEGURIDAD PARA ROLES
const PermisoGuard = ({ children, rolesPermitidos }: { children: JSX.Element; rolesPermitidos: string[] }) => {
  const { rol } = useRol();
  
  // Recuperamos directamente del storage por si el estado de React está demorado
  const localRol = localStorage.getItem("userRole");
  const rolActual = rol || localRol;

  // Si todavía no hay ningún rol guardado (está sincronizando), mostramos un loader limpio
  if (!rolActual) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando permisos...</span>
        </div>
      </div>
    );
  }

  // Si ya tenemos el rol y no está en la lista de permitidos, ahí sí lo sacamos
  if (!rolesPermitidos.includes(rolActual)) {
    console.warn(`Acceso denegado para el rol: ${rolActual}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <>
      <Routes>
        {/* 1. RUTA PÚBLICA / LANDING */}
        <Route path="/" element={<Index />}>
          <Route index element={<Home />} />
          <Route path="categorias" element={<Categories />} />
          <Route path="promociones" element={<Promotions />} />
          <Route path="description/:tipo/:id" element={<DescriptionPromotion />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago-confirmado" element={<PagoConfirmado />} />
        </Route>

        {/* 2. AUTHENTICATION & LOGIN FLOW */}
        <Route path="/mi-perfil" element={<AuthenticationGuard component={MiPerfil} />} />
        <Route path="/callback" element={<CallBack />} />
        <Route path="mis-pedidos" element={<MisPedidos />} />
        <Route path="/post-login" element={<PostLoginRedirect />} />
        <Route path="/completar-perfil" element={<CompletarPerfil />} />

        {/* 3. PANEL DE ADMINISTRACIÓN (PROTEGIDO) */}
        <Route path="/panel-usuario" element={<AuthenticationGuard component={Root} />}>
          
          {/* Dashboard Inicial: Acceso Administradores y Cajero */}
          <Route index element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN", "CAJERO"]}>
              <Inicio />
            </PermisoGuard>
          } />

          {/* Operaciones */}
          <Route path="pedidos/monitor" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN", "CAJERO", "COCINERO", "DELIVERY"]}>
              <MonitorPedidos />
            </PermisoGuard>
          } />
          
          <Route path="pedidos/historial" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN", "CAJERO"]}>
              <HistorialPedidos />
            </PermisoGuard>
          } />
          
          <Route path="clientes" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN", "CAJERO"]}>
              <Clientes />
            </PermisoGuard>
          } />

          {/* Catálogo (Lectura para Cajero/Cocinero, Escritura gestionada por Front) */}
          <Route path="articulos" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN", "CAJERO", "COCINERO"]}>
              <GrillaArticulo />
            </PermisoGuard>
          } />
          <Route path="articulos/save/:id" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN"]}>
              <SaveArticulo />
            </PermisoGuard>
          } />
          
          <Route path="categorias" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN", "CAJERO", "COCINERO"]}>
              <GrillaCategoria />
            </PermisoGuard>
          } />
          <Route path="categorias/save/:id" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN"]}>
              <SaveCategoria />
            </PermisoGuard>
          } />
          
          <Route path="promociones" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN", "CAJERO"]}>
              <GrillaPromocion />
            </PermisoGuard>
          } />
          <Route path="promociones/save/:id" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN"]}>
              <SavePromocion />
            </PermisoGuard>
          } />

          {/* Logística */}
          <Route path="insumos" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN", "COCINERO"]}>
              <GrillaInsumo />
            </PermisoGuard>
          } />
          <Route path="insumos/save/:id" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN", "COCINERO"]}>
              <SaveInsumo />
            </PermisoGuard>
          } />
          <Route path="unidades-medida" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN", "COCINERO"]}>
              <GrillaUnidadMedida />
            </PermisoGuard>
          } /> 
          <Route path="unidades-medida/save/:id" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN"]}>
              <SaveUnidadMedida />
            </PermisoGuard>
          } />

          {/* Administración */}
          <Route path="sucursales" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN"]}>
              <GrillaSucursal />
            </PermisoGuard>
          } />
          <Route path="sucursales/save/:id" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN"]}>
              <SaveSucursal />
            </PermisoGuard>
          } />
          <Route path="empleados" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN"]}>
              <GrillaEmpleado />
            </PermisoGuard>
          } />
          <Route path="empleados/save/:id" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN"]}>
              <SaveEmpleado />
            </PermisoGuard>
          } />
          <Route path="roles" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN"]}>
              <GrillaRol />
            </PermisoGuard>
          } />
          <Route path="roles/save/:id" element={
            <PermisoGuard rolesPermitidos={["SUPERADMIN", "ADMIN"]}>
              <SaveRol /> 
            </PermisoGuard>
          } />
          
        </Route>
        
      </Routes>
    </>
  );
};