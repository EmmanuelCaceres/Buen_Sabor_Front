import { cilBuilding, cilCart, cilFastfood, cilGift, cilHome, cilPeople, cilList, cilUser, cilBalanceScale, cilLockLocked } from "@coreui/icons"; // 👈 Agregamos cilLockLocked
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import "@coreui/coreui/dist/css/coreui.min.css";
import { CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarNav } from "@coreui/react";
import { useRol } from "../context/RolContext"; // Ajustá la ruta
import "../index.css";

export default function SideBar() {
  const { rol } = useRol(); // Leemos el rol actual del usuario logueado

  return (
    <div className="sidebar-container sidebar">
      <CSidebar className="border-end d-flex flex-column h-100" style={{ backgroundColor: "#ffffff" }}>
        <CSidebarNav>
          
          {/* --- DASHBOARD --- */}
          {(rol === "SUPERADMIN" || rol === "ADMIN" || rol === "CAJERO") && (
            <>
              <CNavTitle>Dashboard</CNavTitle>
              <CNavItem>
                <Link to="/panel-usuario" className="nav-link">
                  <CIcon customClassName="nav-icon" icon={cilHome} /> Inicio
                </Link>
              </CNavItem>
            </>
          )}

          {/* --- OPERACIONES --- */}
          {(rol === "SUPERADMIN" || rol === "ADMIN" || rol === "CAJERO" || rol === "COCINERO" || rol === "DELIVERY") && (
            <>
              <CNavTitle>Operaciones</CNavTitle>
              <CNavGroup toggler={<><CIcon customClassName="nav-icon" icon={cilList} /> Pedidos</>}>
                
                {/* Monitor: visible para todos los empleados */}
                <CNavItem>
                  <Link to="/panel-usuario/pedidos/monitor" className="nav-link">
                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span> Monitor de Pedidos
                  </Link>
                </CNavItem>

                {/* Historial: Oculto para Cocinero y Delivery */}
                {(rol === "SUPERADMIN" || rol === "ADMIN" || rol === "CAJERO") && (
                  <CNavItem>
                    <Link to="/panel-usuario/pedidos/historial" className="nav-link">
                      <span className="nav-icon"><span className="nav-icon-bullet"></span></span> Historial
                    </Link>
                  </CNavItem>
                )}
              </CNavGroup>
            </>
          )}

          {/* Clientes: Oculto para Cocinero y Delivery */}
          {(rol === "SUPERADMIN" || rol === "ADMIN" || rol === "CAJERO") && (
            <CNavItem>
              <Link to="/panel-usuario/clientes" className="nav-link">
                <span className="nav-icon"><CIcon customClassName="nav-icon" icon={cilUser} /></span> Clientes
              </Link>
            </CNavItem>
          )}

          {/* --- CATÁLOGO --- */}
          {(rol === "SUPERADMIN" || rol === "ADMIN" || rol === "CAJERO" || rol === "COCINERO") && (
            <>
              <CNavTitle>Catálogo</CNavTitle>
              <CNavGroup toggler={<><CIcon customClassName="nav-icon" icon={cilFastfood} /> Artículos</>}>
                <CNavItem>
                  <Link to="/panel-usuario/articulos" className="nav-link">
                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span> Lista de Productos
                  </Link>
                </CNavItem>
                <CNavItem>
                  <Link to="/panel-usuario/categories" className="nav-link">
                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span> Categorías
                  </Link>
                </CNavItem>
              </CNavGroup>
              {/* Promociones: Oculto para Cocinero */}
              {(rol === "SUPERADMIN" || rol === "ADMIN" || rol === "CAJERO") && (
                <CNavItem>
                  <Link to="/panel-usuario/promociones" className="nav-link">
                    <CIcon customClassName="nav-icon" icon={cilGift} /> Promociones
                  </Link>
                </CNavItem>
              )}
            </>
          )}

          {/* --- LOGÍSTICA --- */}
          {(rol === "SUPERADMIN" || rol === "ADMIN" || rol === "COCINERO") && (
            <>
              <CNavTitle>Logística</CNavTitle>
              <CNavItem>
                <Link to="/panel-usuario/insumos" className="nav-link">
                  <CIcon customClassName="nav-icon" icon={cilCart} /> Insumos
                </Link>
              </CNavItem>
              <CNavItem>
                <Link to="/panel-usuario/unidades-medida" className="nav-link">
                  <CIcon customClassName="nav-icon" icon={cilBalanceScale} /> Unidades de Medida
                </Link>
              </CNavItem>
            </>
          )}

          {/* --- ADMINISTRACIÓN --- */}
          {(rol === "SUPERADMIN" || rol === "ADMIN") && (
            <>
              <CNavTitle>Administración</CNavTitle>
              <CNavItem>
                <Link to="/panel-usuario/empleados" className="nav-link">
                  <CIcon customClassName="nav-icon" icon={cilPeople} /> Empleados
                </Link>
              </CNavItem>
              
              {/* Sucursales: SOLO SUPERADMIN */}
              {rol === "SUPERADMIN" && (
                <CNavItem>
                  <Link to="/panel-usuario/sucursales" className="nav-link">
                    <CIcon customClassName="nav-icon" icon={cilBuilding} /> Sucursales
                  </Link>
                </CNavItem>
              )}
              
              {/* Roles: visible para SUPERADMIN y ADMIN 👈 Cambiamos el icono a cilLockLocked */}
              <CNavItem>
                <Link to="/panel-usuario/roles" className="nav-link">
                  <CIcon customClassName="nav-icon" icon={cilLockLocked} /> Gestión de Roles
                </Link>
              </CNavItem>
            </>
          )}
        </CSidebarNav>
      </CSidebar>
    </div>
  );
}