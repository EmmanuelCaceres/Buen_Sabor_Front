import {NavBarPublic} from "../../Components"
import { LabelPublic } from "../../Components"
import { Outlet } from "react-router-dom"


export const Home = () =>{
    return(
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <header>
                <NavBarPublic/>
            </header>
            <main style={{ flex: 1}}>
                <LabelPublic text="Bienvenido a Tu Tienda"/>
                 <Outlet />
            </main>
            <footer>
                <div style={{ backgroundColor: "#f0f0f0", padding: "0 16px", textAlign: "center", height:"80px" }}>
                    <p>© 2023 Tu Tienda. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    )
}