import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"

export default function Root() {
    return (
        <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
            <div style={{ display: "flex",flex:"1" }}>
                <SideBar />
                <Outlet />
            </div>
        </div>
    )
}