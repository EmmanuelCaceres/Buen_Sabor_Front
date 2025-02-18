import { cilBuilding, cilCart, cilFastfood, cilGift, cilHome, cilPeople } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import '@coreui/coreui/dist/css/coreui.min.css';
import { CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarNav } from "@coreui/react";
import "../index.css"

export default function SideBar() {

    return (
        <div className="sidebar-container sidebar">
            <CSidebar className="border-end d-flex flex-column h-100" style={{ backgroundColor:"#ffffff"}}>
                <CSidebarNav>
                    <CNavTitle>
                        Dashboard
                    </CNavTitle>
                    <CNavItem>
                        <Link to="/panel-usuario" className="nav-link" >
                            <CIcon customClassName="nav-icon" icon={cilHome} />
                            Inicio
                        </Link>
                    </CNavItem>

                    <CNavItem>
                        <Link to="/panel-usuario/empresas" className="nav-link">
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
                            <Link to="/panel-usuario/articulos" className="nav-link" >
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Lista de Productos
                            </Link>
                        </CNavItem>
                        <CNavItem>
                            <Link to="/panel-usuario/categorias" className="nav-link">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Categorías
                            </Link>
                        </CNavItem>
                    </CNavGroup>

                    <CNavItem>
                        <Link to="/panel-usuario/promociones" className="nav-link">
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
                            <Link to="/panel-usuario/empleados" className="nav-link" >
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Lista de Empleados
                            </Link>
                        </CNavItem>
                    </CNavGroup>
                    <CNavItem>
                        <Link to="/panel-usuario/insumos" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilCart} />
                            Insumos
                        </Link>
                    </CNavItem>
                    <CNavItem>
                        <Link to="/panel-usuario/pedidos" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilCart} />
                            Pedidos
                        </Link>
                    </CNavItem>
                </CSidebarNav>
            </CSidebar>
        </div>
    );
}
