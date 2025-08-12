import { CContainer, CNavbar, CNavbarBrand, CNavbarToggler, CButton } from "@coreui/react"
import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react";

export default function NavBar() {
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <CNavbar className="bg-dark header">
            <CContainer fluid className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <img src={logoImage} alt="Logo" style={{ height: "auto", width: "45px", marginLeft: "15px", color: "white" }} />
                    <CNavbarBrand href="#" className="ms-3" style={{ fontFamily: 'Arial, sans-serif', fontSize: '1rem', color: '#c6c9de', fontWeight: 'bold' }}>
                        EL BUEN SABOR
                    </CNavbarBrand>
                </div>

                <div>
                    {!isAuthenticated ? (
                        <CButton color="primary" onClick={() => loginWithRedirect()}>
                            Login
                        </CButton>
                    ) : (
                        <>
                            <span style={{ color: '#c6c9de', marginRight: '10px' }}>
                                Hola, {user?.name}
                            </span>
                            <CButton color="secondary" onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}>
                                Logout
                            </CButton>
                        </>
                    )}
                </div>

                <CNavbarToggler onClick={toggleSidebar} className="me-3" style={{color: '#c6c9de'}}/>
            </CContainer>
        </CNavbar>
    )
}