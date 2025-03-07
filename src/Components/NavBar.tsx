import { CContainer, CNavbar, CNavbarBrand, CNavbarToggler } from "@coreui/react"
import { useState } from "react"
import logoImage from "../assets/imagenes/hamburguesa.svg";
import "../index.css"


export default function NavBar() {
    const [sidebarVisible, setSidebarVisible] = useState(false)

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
                <CNavbarToggler onClick={toggleSidebar} className="me-3" style={{color: '#c6c9de'}}/>
            </CContainer>
        </CNavbar>
    )
}
