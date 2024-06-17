import { cilBuilding, cilCart, cilFastfood, cilGift, cilHome, cilPeople } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import '@coreui/coreui/dist/css/coreui.min.css';
import { CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarNav } from "@coreui/react";

export default function SideBar() {

    return (
        <div className="sidebar-container">
            <CSidebar className="border-end d-flex flex-column h-100">
                <CSidebarNav>
                    <CNavTitle>
                        Dashboard
                    </CNavTitle>
                    <CNavItem>
                        <Link to="/" className="nav-link" >
                            <CIcon customClassName="nav-icon" icon={cilHome} />
                            Inicio
                        </Link>
                    </CNavItem>

                    <CNavItem>
                        <Link to="/empresas" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilBuilding} />
                            Empresa
                        </Link>
                    </CNavItem>
                    <CNavGroup
                        toggler={
                            <>
                                <CIcon customClassName="nav-icon" icon={cilFastfood} />
                                Articulos
                            </>
                        }
                    >
                        <CNavItem>
                            <Link to="/articulos" className="nav-link" >
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Lista de Productos
                            </Link>
                        </CNavItem>
                        <CNavItem>
                            <Link to="/categorias" className="nav-link">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Categorías
                            </Link>
                        </CNavItem>
                    </CNavGroup>

                    <CNavItem>
                        <Link to="/promociones" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilGift} />
                            Promociones
                        </Link>
                    </CNavItem>

                    <CNavGroup
                        toggler={
                            <>
                                <CIcon customClassName="nav-icon" icon={cilPeople} />
                                Empleados
                            </>
                        }
                    >
                        <CNavItem>
                            <Link to="/empleados" className="nav-link" >
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Lista de Empleados
                            </Link>
                        </CNavItem>
                        <CNavItem>
                            <Link to="/roles" className="nav-link">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Roles
                            </Link>
                        </CNavItem>
                    </CNavGroup>
                    <CNavItem>
                        <Link to="/insumos" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilCart} />
                            Insumos
                        </Link>
                    </CNavItem>
                    <CNavItem>
                        <Link to="/pedidos" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilCart} />
                            Pedidos
                        </Link>
                    </CNavItem>
                </CSidebarNav>
            </CSidebar>
        </div>
    );
}
