import { Route, Routes } from "react-router-dom"
import { AuthenticationGuard, Profile, CallBack, Home } from "./Components"
import Root from "./Components/Root";
import GrillaArticulo from "./Components/Grillas/GrillaArticuloManufacturado";
import SaveArticulo from "./FormSave/SaveArticuloManufacturado";
import SaveInsumo from "./FormSave/SaveInsumo";
import SaveCategoria from "./FormSave/SaveCategoria";
import GrillaEmpleado from "./Components/Grillas/GrillaEmpleado";
import GrillaRol from "./Components/Grillas/GrillaRol";
import GrillaPromocion from "./Components/Grillas/GrillaPromocion";
import SavePromocion from "./FormSave/SavePromocion";
import Pedidos from "./Components/Pedidos";
import GrillaInsumo from "./Components/Grillas/GrillaInsumo";
import GrillaCategoria from "./Components/Grillas/GrillaCategoria";
import SaveEmpleado from "./FormSave/SaveEmpleado";
import GrillaSucursal from "./Components/Grillas/GrillaSucursal";
import SaveSucursal from "./FormSave/SaveSucursal";
import { useSucursal } from "./context/SucursalContext"; // 👈 importá el hook

export const App = () => {
    const { sucursalNombre } = useSucursal(); // 👈 usá el contexto

    return (
        <>
            <header style={{ background: "#f0f0f0", padding: "10px 20px", marginBottom: "15px" }}>
                <h5 style={{ margin: 0 }}>
                    Sucursal seleccionada: <strong>{sucursalNombre || "Ninguna"}</strong>
                </h5>
            </header>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<AuthenticationGuard component={Profile} />} />
                <Route path="/callback" element={<CallBack />} />
                <Route path="/panel-usuario" element={<Root />}>
                    <Route path="articulos" element={<GrillaArticulo />} />
                    <Route path="articulos/save/:id" element={<SaveArticulo />} />
                    <Route path="insumos/save/:id" element={<SaveInsumo />} />
                    <Route path="categorias/save/:id" element={<SaveCategoria />} />
                    <Route path="sucursales" element={<GrillaSucursal />} />
                    <Route path="sucursales/save/:id" element={<SaveSucursal />} />
                    <Route path="categorias" element={<GrillaCategoria />} />
                    <Route path="empleados" element={<GrillaEmpleado />} />
                    <Route path="empleados/save/:id" element={<SaveEmpleado />} />
                    <Route path="roles" element={<GrillaRol />} />
                    <Route path="promociones" element={<GrillaPromocion />} />
                    <Route path="promociones/save/:id" element={<SavePromocion />} />
                    <Route path="insumos" element={<GrillaInsumo />} />
                    <Route path="pedidos" element={<Pedidos />} />
                </Route>
            </Routes>
        </>
    )
}
