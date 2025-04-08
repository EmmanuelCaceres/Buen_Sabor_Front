import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0ProviderWithNavigate } from './Components';
import { App } from './App';
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { ModalProvider } from './Components/Modal/context/ModalContext';
import { SucursalProvider } from './context/SucursalContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <SucursalProvider>
          <Auth0ProviderWithNavigate>
            <App />
          </Auth0ProviderWithNavigate>
        </SucursalProvider>
      </ModalProvider>
    </BrowserRouter>
  </StrictMode>,
);


