
import { Outlet } from "react-router-dom";
import { NavBarPublic } from "../Components";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Carrito from "../Components/Lado Cliente/Carrito";
import { CContainer, CRow, CCol } from "@coreui/react";

const Index = () => {
    const { isCartVisible } = useSelector((state: RootState) => state.cart);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <header>
                <NavBarPublic />
            </header>
            <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                {/* Main Content Area */}
                <main 
                    style={{
                        flexGrow: 1,
                        padding: "32px 90px",
                        transition: 'width 0.3s ease-in-out',
                        width: isCartVisible ? '75%' : '100%',
                        overflowY: 'auto' 
                    }}
                >
                    <Outlet />
                </main>

                {/* Cart Sidebar */}
                <aside 
                    style={{
                        
                        width: isCartVisible ? '25%' : '0%',
                        transition: 'width 0.3s ease-in-out',
                        overflow: 'hidden',
                        height: '100%',
                        borderLeft: isCartVisible ? '1px solid #dee2e6' : 'none',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    <div style={{ height: '100%', overflowY: 'auto',display:'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center', }}>
                        <Carrito />
                    </div>
                </aside>
            </div>
            <footer>
                <div style={{ backgroundColor: "#f0f0f0", padding: "0 16px", textAlign: "center", height:"80px" }}>
                    <p>© 2024 El Buen Sabor. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Index;
