import { CContainer, CNavbar, CNavbarBrand, CNavbarToggler, CButton, CAvatar } from "@coreui/react"
import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react";

export default function NavBar() {
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <CNavbar 
            className="header shadow-sm py-2 px-0" // px-0 aquí es clave
            style={{ 
                backgroundColor: '#1a1a1a', 
                borderBottom: '1px solid #333',
                position: 'sticky',
                top: 0,
                zIndex: 1020,
                width: '100%' // Asegura que el NavBar ocupe todo el ancho del wrapper
            }}
        >
            {/* VOLVEMOS A USAR fluid AQUÍ para que se estire */}
            {/* Agregamos px-4 para dar margen interno y que no toque los bordes */}
            <CContainer fluid className="d-flex justify-content-between align-items-center px-4">
                <div className="d-flex align-items-center">
                    <CNavbarBrand href="#" className="d-flex align-items-center ms-0" style={{ textDecoration: 'none' }}>
                        <div className="bg-primary p-2 rounded-3 me-2 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                            <span className="text-white fw-black" style={{ fontSize: '1.2rem' }}>B</span>
                        </div>
                        <span style={{ 
                            fontFamily: 'Inter, sans-serif', 
                            letterSpacing: '1px',
                            fontSize: '0.95rem', 
                            color: '#fff', 
                            fontWeight: '700' 
                        }}>
                            EL BUEN <span className="text-primary">SABOR</span>
                        </span>
                    </CNavbarBrand>
                </div>

                <div className="d-flex align-items-center gap-3">
                    {!isAuthenticated ? (
                        <CButton 
                            color="primary" 
                            className="fw-bold px-4 rounded-pill shadow-sm"
                            style={{ fontSize: '0.85rem' }}
                            onClick={() => loginWithRedirect()}
                        >
                            Ingresar
                        </CButton>
                    ) : (
                        <div className="d-flex align-items-center bg-dark-light p-1 pe-3 rounded-pill border border-secondary" style={{ backgroundColor: '#2a2a2a' }}>
                            <CAvatar src={user?.picture} className="me-2" size="sm" />
                            <div className="d-none d-md-block me-3">
                                <small className="text-muted d-block" style={{ fontSize: '0.6rem', lineHeight: 1 }}>Bienvenido</small>
                                <span className="fw-semibold text-white" style={{ fontSize: '0.85rem' }}>{user?.given_name || user?.name}</span>
                            </div>
                            <CButton 
                                color="light" 
                                variant="ghost" 
                                size="sm" 
                                className="text-danger p-0 fw-bold" 
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}
                            >
                                Salir
                            </CButton>
                        </div>
                    )}
                    
                    {/* Toggler estilizado y visible */}
                    <CNavbarToggler 
                        onClick={toggleSidebar} 
                        className="border-0 p-1 custom-toggler" 
                        style={{ filter: 'invert(1)', opacity: 0.8 }}
                    />
                </div>
            </CContainer>
        </CNavbar>
    )
}