import { Route, Routes } from "react-router-dom"
import { AuthenticationGuard, Profile, CallBack, Header,Home } from "./Components"
import { useAuth0 } from "@auth0/auth0-react"
import Root from "./Components/Root";
import GrillaArticulo from "./Components/Grillas/GrillaArticuloManufacturado";
import SaveArticulo from "./FormSave/SaveArticuloManufacturado";
import SaveInsumo from "./FormSave/SaveInsumo";
import SaveCategoria from "./FormSave/SaveCategoria";
import GrillaEmpresa from "./Components/Grillas/GrillaEmpresa";
import SaveEmpresa from "./FormSave/SaveEmpresa";
import GrillaEmpleado from "./Components/Grillas/GrillaEmpleado";
import GrillaRol from "./Components/Grillas/GrillaRol";
import GrillaPromocion from "./Components/Grillas/GrillaPromocion";
import SavePromocion from "./FormSave/SavePromocion";
import Pedidos from "./Components/Pedidos";
import GrillaInsumo from "./Components/Grillas/GrillaInsumo";
import GrillaCategoria from "./Components/Grillas/GrillaCategoria";

export const App = () => {
    
    return (
        <>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/profile" element={<AuthenticationGuard component={Profile} />} />
                <Route path="/callback" element={<CallBack />} />
                <Route path="/panel-usuario" element={<Root/>}>
                    <Route path="articulos" element={<GrillaArticulo/>}/>
                    <Route path="articulos/save/:id" element={<SaveArticulo/>}/>
                    <Route path="insumos/save/:id" element={<SaveInsumo/>}></Route>
                    <Route path="categorias/save/:id" element={<SaveCategoria/>}></Route>
                    <Route path="empresas" element={<GrillaEmpresa/>}></Route>
                    <Route path="empresas/save/:id" element={<SaveEmpresa/>}></Route>
                    <Route path="categorias" element={<GrillaCategoria/>}></Route>
                    <Route path="empleados" element={<GrillaEmpleado/>}></Route>
                    <Route path="roles" element={<GrillaRol/>}></Route>
                    <Route path="promociones" element={<GrillaPromocion/>}></Route>
                    <Route path="promociones/save/:id" element={<SavePromocion/>}></Route>
                    <Route path="insumos" element={<GrillaInsumo/>}></Route>
                    <Route path="pedidos" element={<Pedidos/>}></Route>

                </Route>
            </Routes>
        </>
    )
}

 // {
  //   path: "/",
  //   element: <Root/>,
  //   errorElement:<ErrorPage/>,
  //   children: [
  //     {
  //       path:"categorias",
  //       element:<GrillaCategoria/>
  //     },
  //     {
  //       path:"insumos",
  //       element:<GrillaInsumo/>
  //     },
  //   ],
  // },
  // {
  //   path:"/homeEmpresa",
  //   element:<HomeEmpresa/>
  // },
  // {
  //   path:"/sucursales/:id",
  //   element:<Sucursales/>
  // },
  // {
  //   path:"/cliente/menu",
  //   element:<Menu/>
  // }
  // {
  //   path:"/",
  //   element:<Empresas/>
  // },
  // {
  //   path:"/empresa/:id",
  //   element:{<AuthenticationGuard component={Sucursales}/>}
  // }
  // {
  //   path="/profile",
  //   element={<AuthenticationGuard component={Profile}/>}
  // }