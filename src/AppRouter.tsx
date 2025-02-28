import { ReactNode } from "react"
import { BrowserRouter,Routes,Route, Navigate } from "react-router-dom"
import { Login } from "./public/Login/Login"
// import Root from "./Components/Root"
// import { PrivateGuard } from "./Components/Auth0/PrivateGuard/PrivateGuard"

interface Props{
    children: ReactNode
}
export const AppRouter = ()=>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={"/login"} />}/>
                <Route path="/login" element={<Login/>}/>
                {/* <Route element={<PrivateGuard/>}>
                    <Route path="/panel-usuario" element={<Root/>}/>
                </Route> */}
            </Routes>
        </BrowserRouter>
    )
}