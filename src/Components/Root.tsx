import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"
import NavBar from "./NavBar"
import "../index.css"

export default function Root() {
    return (
        <div className="rootContainer d-flex flex-column min-vh-100">
            {/* 1. NavBar arriba de todo (Ocupa el 100% del ancho) */}
            <NavBar />

            {/* 2. El cuerpo de la app (Sidebar + Contenido) */}
            <div className="d-flex flex-grow-1">
                {/* Menú lateral */}
                <SideBar />

                {/* Área de visualización */}
                <main className="content flex-grow-1 p-0 m-0" style={{ minWidth: 0 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}