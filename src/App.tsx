import { Route, Routes } from "react-router-dom";
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
//import Pedidos from "./Components/Pedidos";
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

export const App = () => {
  return (
    <>
      <Routes>
        {/* 1. RUTA PÚBLICA / LANDING */}
        <Route path="/" element={<Index />}>
          <Route index element={<Home />} />
          <Route path="categorias" element={<Categories />} />
          <Route path="promociones" element={<Promotions />} />
          <Route
            path="description/:tipo/:id"
            element={<DescriptionPromotion />}
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago-confirmado" element={<PagoConfirmado />} />
        </Route>

        {/* 2. AUTHENTICATION & LOGIN FLOW */}
        <Route
          path="/mi-perfil"
          element={<AuthenticationGuard component={MiPerfil} />}
        />
        <Route path="/callback" element={<CallBack />} />
        <Route path="mis-pedidos" element={<MisPedidos />} />

        {/* PostLoginRedirect es el encargado de:
                  - Guardar el usuario en la BD (registerIfNotExists).
                  - Verificar si faltan datos de 'Persona'.
                  - Redirigir a '/' o a '/completar-perfil'.
                */}
        <Route path="/post-login" element={<PostLoginRedirect />} />
        <Route path="/completar-perfil" element={<CompletarPerfil />} />

        {/* 3. PANEL DE ADMINISTRACIÓN (BACKOFFICE) */}
        <Route path="/panel-usuario" element={<Root />}>
          {/* Operaciones */}
          <Route
            path="pedidos/monitor"
            element={<MonitorPedidos />}
          />
          <Route
            path="pedidos/historial"
            element={
              <div>
                <h2>Historial de Pedidos</h2>
              </div>
            }
          />
          <Route
            path="clientes"
            element={
              <div>
                <h2>Grilla de Clientes Registrados</h2>
              </div>
            }
          />

          {/* Catálogo */}
          <Route path="articulos" element={<GrillaArticulo />} />
          <Route path="articulos/save/:id" element={<SaveArticulo />} />
          <Route path="categorias" element={<GrillaCategoria />} />
          <Route path="categorias/save/:id" element={<SaveCategoria />} />
          <Route path="promociones" element={<GrillaPromocion />} />
          <Route path="promociones/save/:id" element={<SavePromocion />} />

          {/* Logística */}
          <Route path="insumos" element={<GrillaInsumo />} />
          <Route path="insumos/save/:id" element={<SaveInsumo />} />
          <Route
            path="unidades-medida"
            element={
              <div>
                <h2>Grilla Unidades de Medida</h2>
              </div>
            }
          />

          {/* Administración */}
          <Route path="sucursales" element={<GrillaSucursal />} />
          <Route path="sucursales/save/:id" element={<SaveSucursal />} />
          <Route path="empleados" element={<GrillaEmpleado />} />
          <Route path="empleados/save/:id" element={<SaveEmpleado />} />
          <Route path="roles" element={<GrillaRol />} />

          {/* Ruta por defecto del panel (Dashboard inicial) */}
          <Route
            index
            element={
              <div>
                <h2>Bienvenido al Dashboard de El Buen Sabor</h2>
              </div>
            }
          />
        </Route>
      </Routes>
    </>
  );
};
