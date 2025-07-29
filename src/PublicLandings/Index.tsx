import { Outlet } from "react-router-dom";
import { NavBarPublic } from "../Components";

export default function Index(){
    return(
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <header>
                <NavBarPublic/>
            </header>
            <main style={{flexGrow:"1", padding:"32px 90px"}}>
                <Outlet/>
            </main>
            <footer>
                <div style={{ backgroundColor: "#f0f0f0", padding: "0 16px", textAlign: "center", height:"80px" }}>
                    <p>© 2023 Tu Tienda. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    )
}