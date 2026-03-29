import {
  cilBuilding,
  cilCart,
  cilFastfood,
  cilGift,
  cilHome,
  cilPeople,
  cilList,
  cilUser,
  cilBalanceScale,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import "@coreui/coreui/dist/css/coreui.min.css";
import {
  CNavGroup,
  CNavItem,
  CNavTitle,
  CSidebar,
  CSidebarNav,
} from "@coreui/react";
import "../index.css";

export default function SideBar() {
  return (
    <div className="sidebar-container sidebar">
      <CSidebar
        className="border-end d-flex flex-column h-100"
        style={{ backgroundColor: "#ffffff" }}
      >
        <CSidebarNav>
          {/* --- SECCIÓN PRINCIPAL --- */}
          <CNavTitle>Dashboard</CNavTitle>
          <CNavItem>
            <Link to="/panel-usuario" className="nav-link">
              <CIcon customClassName="nav-icon" icon={cilHome} />
              Inicio
            </Link>
          </CNavItem>

          {/* --- OPERACIONES --- */}
          <CNavTitle>Operaciones</CNavTitle>

          <CNavGroup
            toggler={
              <>
                <CIcon customClassName="nav-icon" icon={cilList} />
                Pedidos
              </>
            }
          >
            <CNavItem>
              <Link to="/panel-usuario/pedidos/monitor" className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
                Monitor de Pedidos
              </Link>
            </CNavItem>
            <CNavItem>
              <Link to="/panel-usuario/pedidos/historial" className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
                Historial
              </Link>
            </CNavItem>
          </CNavGroup>

          <CNavItem>
            <Link to="/panel-usuario/clientes" className="nav-link">
              <CIcon customClassName="nav-icon" icon={cilUser} />
              Clientes
            </Link>
          </CNavItem>

          {/* --- GESTIÓN DE PRODUCTOS --- */}
          <CNavTitle>Catálogo</CNavTitle>
          <CNavGroup
            toggler={
              <>
                <CIcon customClassName="nav-icon" icon={cilFastfood} />
                Artículos
              </>
            }
          >
            <CNavItem>
              <Link to="/panel-usuario/articulos" className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
                Lista de Productos
              </Link>
            </CNavItem>
            <CNavItem>
              <Link to="/panel-usuario/categorias" className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
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

          {/* --- LOGÍSTICA E INVENTARIO --- */}
          <CNavTitle>Logística</CNavTitle>
          <CNavItem>
            <Link to="/panel-usuario/insumos" className="nav-link">
              <CIcon customClassName="nav-icon" icon={cilCart} />
              Insumos
            </Link>
          </CNavItem>
          <CNavItem>
            <Link to="/panel-usuario/unidades-medida" className="nav-link">
              <CIcon customClassName="nav-icon" icon={cilBalanceScale} />
              Unidades de Medida
            </Link>
          </CNavItem>

          {/* --- ADMINISTRACIÓN --- */}
          <CNavTitle>Administración</CNavTitle>
          <CNavItem>
            <Link to="/panel-usuario/empleados" className="nav-link">
              <CIcon customClassName="nav-icon" icon={cilPeople} />
              Empleados
            </Link>
          </CNavItem>
          <CNavItem>
            <Link to="/panel-usuario/sucursales" className="nav-link">
              <CIcon customClassName="nav-icon" icon={cilBuilding} />
              Sucursales
            </Link>
          </CNavItem>
        </CSidebarNav>
      </CSidebar>
    </div>
  );
}
