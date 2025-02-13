import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"
import NavBar from "./NavBar"
import "../index.css"

export default function Root() {
    return (
        <div className="rootContainer">
            <NavBar/>
            <SideBar/>
            <div className="content">
                <Outlet/>
            </div>
        </div>
    )
}