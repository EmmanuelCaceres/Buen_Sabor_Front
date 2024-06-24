import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"
import NavBar from "./NavBar"

export default function Root() {
    return (
        <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
            <div style={{ display: "flex",flex:"1" }}>
                <NavBar></NavBar>
                <SideBar />
                <Outlet />
            </div>
        </div>
    )
}