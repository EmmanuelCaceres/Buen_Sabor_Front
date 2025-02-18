import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'
import {Auth0ProviderWithNavigate, AuthenticationGuard,Profile} from './Components'
import { App } from './App';
// import {Auth0ProviderWithNavigate} from './Components';
import {createBrowserRouter,RouterProvider,BrowserRouter} from "react-router-dom";
// import Root from './Components/Root.tsx';
// import ErrorPage from './Components/ErrorPage.tsx';
// import SaveArticulo from './FormSave/SaveArticuloManufacturado.tsx';
// import GrillaArticulo from './Components/Grillas/GrillaArticuloManufacturado.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { ModalProvider } from './Components/Modal/context/ModalContext';
// import GrillaEmpresa from './Components/Grillas/GrillaEmpresa.tsx';
// import GrillaCategoria from './Components/Grillas/GrillaCategoria.tsx';
// import GrillaEmpleado from './Components/Grillas/GrillaEmpleado.tsx';
// import GrillaRol from './Components/Grillas/GrillaRol.tsx';
// import GrillaPromocion from './Components/Grillas/GrillaPromocion.tsx';
// import GrillaInsumo from './Components/Grillas/GrillaInsumo.tsx';
// import SaveInsumo from './FormSave/SaveInsumo.tsx';
// import SaveCategoria from './FormSave/SaveCategoria.tsx';
// import HomeEmpresa from './Components/HomeEmpresa.tsx';
// import Sucursales from './Components/Sucursales.tsx';
// import Menu from './Components/Lado Cliente/Menu.tsx';
// import Pedidos from './Components/Pedidos.tsx';
// import { CarritoContextProvider } from './Components/Lado Cliente/context/CarritoContext.tsx';
// import SaveEmpresa from './FormSave/SaveEmpresa.tsx';
// import SavePromocion from './FormSave/SavePromocion.tsx';
// import Empresas from './Components/Lado Admin/Empresas.tsx';
// import Sucursales from './Components/Lado Admin/Sucursales.tsx';

// const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Root/>,
  //   errorElement:<ErrorPage/>,
  //   children: [
  //     {
  //       path: "articulos",
  //       element: <GrillaArticulo />,
  //     },
  //     {
  //       path:"articulos/save/:id",
  //       element:<SaveArticulo/>
  //     },
  //     {
  //       path:"insumos/save/:id",
  //       element:<SaveInsumo/>
  //     },
  //     {
  //       path:"categorias/save/:id",
  //       element:<SaveCategoria/>
  //     },
  //     {
  //       path:"empresas",
  //       element:<GrillaEmpresa/>
  //     },
  //     {
  //       path:"empresas/save/:id",
  //       element:<SaveEmpresa/>
  //     },
  //     {
  //       path:"categorias",
  //       element:<GrillaCategoria/>
  //     },
  //     {
  //       path:"empleados",
  //       element:<GrillaEmpleado/>
  //     },
  //     {
  //       path:"roles",
  //       element:<GrillaRol/>
  //     },
  //     {
  //       path:"promociones",
  //       element:<GrillaPromocion/>
  //     },
  //     {
  //       path:"promociones/save/:id",
  //       element:<SavePromocion/>
  //     },
  //     {
  //       path:"insumos",
  //       element:<GrillaInsumo/>
  //     },
  //     {
  //       path:"pedidos",
  //       element:<Pedidos/>
  //     }
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
// ]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // Controla el correcto funcionamiento de los componentes, crea y destruye los componentes 2 veces, en producción se quita
  <StrictMode>
      <BrowserRouter>
      <ModalProvider>
        <Auth0ProviderWithNavigate>
          <App/>
        </Auth0ProviderWithNavigate>
        </ModalProvider>
      </BrowserRouter>
  </StrictMode>,
)
