import { useEffect, useState } from "react";
import logoImage from "../../../assets/imagenes/hamburguesa.svg";
import {
  CBadge,
  CButton,
  CCollapse,
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toggleCartVisibility } from "../../../redux/slices/cartSlice";
import { useAuth0 } from "@auth0/auth0-react";

export const NavBarPublic = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { detalles } = useSelector((state: RootState) => state.cart);
  const itemCount = detalles.reduce((total, item) => total + item.cantidad, 0);
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    getAccessTokenSilently,
  } = useAuth0();
  const [dbUserImage, setDbUserImage] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_URL_API_BACK;

  useEffect(() => {
    const fetchUserImage = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const token = await getAccessTokenSilently();
          const res = await fetch(
            `${apiUrl}clientes/findByEmail?email=${encodeURIComponent(user?.email || "")}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (res.ok) {
            const cliente = await res.json();
            // Priorizamos la imagen de nuestra base de datos
            if (cliente.imagenPersona?.url) {
              setDbUserImage(cliente.imagenPersona.url);
            }
          }
        } catch (error) {
          console.error("Error al traer la imagen de la BD", error);
        }
      }
    };
    fetchUserImage();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  // Usamos la de la BD, y si no existe, la de Auth0/Google
  const finalImage = dbUserImage || user?.picture;

  const handleCartToggle = () => {
    dispatch(toggleCartVisibility());
  };

  return (
    <CNavbar
      expand="lg"
      className="bg-body-tertiary"
      style={{ border: "1px solid #FF9F00" }}
    >
      <CContainer fluid>
        {/* Quitamos el <Link> externo y usamos 'as={Link}' en el componente de CoreUI */}
        <CNavbarBrand
          as={Link}
          to="/"
          style={{
            display: "flex",
            gap: "8px",
            padding: "12px 12px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "36px",
            border: "1px solid #E5E5E5",
          }}
        >
          <img
            src={logoImage}
            alt="Logo"
            style={{ height: "auto", width: "45px" }}
          />
          EL BUEN SABOR
        </CNavbarBrand>
        <CNavbarToggler onClick={() => setVisible(!visible)} />
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav className="ms-auto">
            <CNavItem>
              <CNavLink href="/" active>
                Inicio
              </CNavLink>
            </CNavItem>
          </CNavbarNav>
          <div className="d-flex align-items-center ms-3">
            <CButton
              onClick={handleCartToggle}
              style={{
                color: "#4f5d73",
                marginRight: "20px",
                textDecoration: "none",
                position: "relative",
                background: "none",
                border: "none",
              }}
            >
              <i
                className="fas fa-shopping-cart"
                style={{ fontSize: "1.5rem" }}
              ></i>
              {itemCount > 0 && (
                <CBadge
                  color="danger"
                  position="top-end"
                  shape="pill"
                  style={{ position: "absolute", top: "-5px", right: "-10px" }}
                >
                  {itemCount}
                </CBadge>
              )}
            </CButton>
            <div className="d-flex align-items-center ms-3">
              {!isAuthenticated ? (
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => loginWithRedirect()}
                >
                  Ingresar
                </CButton>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  {/* Link al perfil con foto y nombre */}
                  <Link
                    to="/mi-perfil"
                    className="d-flex align-items-center text-decoration-none"
                  >
                    <div
                      style={{
                        width: "35px",
                        height: "35px",
                        marginRight: "8px",
                      }}
                    >
                      <img
                        src={finalImage}
                        alt="Avatar"
                        className="rounded-circle"
                        referrerPolicy="no-referrer"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          border: "1px solid #E5E5E5",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.name}&background=random`;
                        }}
                      />
                    </div>
                    <span className="fw-semibold d-none d-md-inline">
                      {user?.nickname || user?.name}
                    </span>
                  </Link>

                  {/* Botón de Salir */}
                  <CButton
                    color="danger"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      logout({
                        logoutParams: {
                          returnTo: window.location.origin, // Esto enviará al usuario a http://localhost:5173/
                        },
                      })
                    }
                  >
                    Salir
                  </CButton>
                </div>
              )}
            </div>
          </div>
        </CCollapse>
      </CContainer>
    </CNavbar>
  );
};
