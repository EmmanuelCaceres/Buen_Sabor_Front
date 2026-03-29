import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: JSX.Element;
};

export const Auth0ProviderWithNavigate = ({ children }: Props) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL || window.location.origin;

  const onRedirectCallback = (appState: AppState | undefined) => {
    // Al terminar el login de Auth0, nos manda a /post-login
    navigate(appState?.returnTo || "/post-login");
  };

  if (!(domain && clientId && redirectUri && audience)) {
    return <div>Faltan variables de entorno para Auth0</div>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience,
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
      // AGREGÁ ESTO PARA LAS COOKIES DE CHROME:
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {/* ELIMINAMOS <AuthRedirectHandler /> DE ACÁ */}
      {children}
    </Auth0Provider>
  );
};
