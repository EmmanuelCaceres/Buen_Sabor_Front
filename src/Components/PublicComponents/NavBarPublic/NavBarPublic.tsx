
import { useState } from 'react';
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
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { toggleCartVisibility } from '../../../redux/slices/cartSlice';

export const NavBarPublic = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { detalles } = useSelector((state: RootState) => state.cart);
  const itemCount = detalles.reduce((total, item) => total + item.cantidad, 0);

  const handleCartToggle = () => {
    dispatch(toggleCartVisibility());
  };

  return (
    <CNavbar expand="lg" className="bg-body-tertiary" style={{ border: "1px solid #FF9F00" }}>
      <CContainer fluid>
        <Link to="/" style={{ textDecoration: "none" }}>
          <CNavbarBrand href="#" style={{ display: "flex", gap: "8px", padding: "12px 12px", alignItems: "center", justifyContent: "center", borderRadius: "36px", border: "1px solid #E5E5E5" }}>
            <img src={logoImage} alt="Logo" style={{ height: "auto", width: "45px", color: "white" }} />
            EL BUEN SABOR
          </CNavbarBrand>
        </Link>
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
            <CButton onClick={handleCartToggle} style={{ color: '#4f5d73', marginRight: '20px', textDecoration: 'none', position: 'relative', background: 'none', border: 'none' }}>
              <i className="fas fa-shopping-cart" style={{ fontSize: '1.5rem' }}></i>
              {itemCount > 0 && (
                <CBadge color="danger" position="top-end" shape="pill" style={{ position: 'absolute', top: '-5px', right: '-10px' }}>
                  {itemCount}
                </CBadge>
              )}
            </CButton>
            {/* Aquí puedes agregar el botón de login/perfil si lo necesitas */}
          </div>
        </CCollapse>
      </CContainer>
    </CNavbar>
  )
}
