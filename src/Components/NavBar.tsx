import { CContainer, CNavbar, CNavbarBrand, CNavbarToggler } from "@coreui/react"
import { useState } from "react"


export default function NavBar() {
    const [sidebarVisible, setSidebarVisible] = useState(false)

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible); 
    };

    return (
        <CNavbar className="bg-primary w-100">
            <CContainer fluid>
                <CNavbarToggler onClick={toggleSidebar} className="me-3" /> 
                <CNavbarBrand href="#">
                    El Buen Sabor
                </CNavbarBrand>
            </CContainer>
        </CNavbar>
    )
}
