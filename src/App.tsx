import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes } from "react-router-dom";
import {
    AuthenticationGuard,
    Profile,
    CallBack,
    Home
} from "./Components";
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
import Categories from "./PublicLandings/Categories"
import Promotions from "./PublicLandings/Promotions"
import { useSucursal } from "./context/SucursalContext"; // 👈 importá el hook
import Index from "./PublicLandings/Index";
import DescriptionPromotion from "./PublicLandings/DescriptionPromotion";


export const App = () => {
    const { sucursalNombre } = useSucursal();
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const saveUserToBackend = async () => {
            if (!isAuthenticated || !user) {
                console.log("No está autenticado o no hay usuario aún");
                return;
            }

            try {
                console.log("Intentando obtener token de acceso...");
                const token = await getAccessTokenSilently();
                console.log("Token obtenido:", token);
                console.log("🔐 Usuario desde Auth0:", user);

                console.log("Usuario a guardar en backend:", {
                    nombre: user.name,
                    email: user.email,
                    sub: user.sub,
                });

                const res = await fetch(`${import.meta.env.VITE_URL_API_BACK}usuarios/registerIfNotExists`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        nombre: user.name,
                        email: user.email,
                        username: user.nickname, // o alguna lógica tuya
                        rol: 2, // o el rol por defecto que asignes
                        auth0Id: user.sub,
                    }),

                });

                console.log("Respuesta del backend:", res.status, res.statusText);

                if (!res.ok && res.status !== 409) { // 409 = conflicto, usuario ya existe (opcional)
                    const text = await res.text();
                    console.error("Error al guardar usuario:", text);
                } else if (res.status === 409) {
                    console.log("Usuario ya existe en la base de datos (409 Conflict).");
                } else {
                    console.log("Usuario guardado o confirmado correctamente en backend.");
                }
            } catch (err) {
                console.error("Error al autenticar o guardar usuario:", err);
            }
        };

        saveUserToBackend();
    }, [isAuthenticated, user, getAccessTokenSilently]);


    return (
        <>
            <Routes>
                <Route path="/" element={<Index />}>
                    <Route index element={<Home />} />
                    <Route path="categorias" element={<Categories />} />
                    <Route path="promociones" element={<Promotions />} />
                    <Route path="description/:id" element={<DescriptionPromotion />} />
                </Route>
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
    );
};
