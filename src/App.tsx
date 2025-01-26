import { Route, Routes } from "react-router-dom"
import { AuthenticationGuard, Profile, ButtonPrimary, CallBack } from "./Components"
import { useAuth0 } from "@auth0/auth0-react"

export const App = () => {
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

    const signupFunction = () => {
        loginWithRedirect(
            {
                appState: {
                    returnTo: "/profile"
                },
                authorizationParams: {
                    screen_hint: "signup"
                }
            }
        )
    }
    const loginFunction = () => {
        loginWithRedirect(
            {
                appState: {
                    returnTo: window.location.pathname
                },
            }
        )
    }
    const logoutFunction = () => {
        logout(
            {
                logoutParams: {
                    returnTo: window.location.origin
                },
            }
        )
    }
    return (
        <>
            {
                isAuthenticated ?
                    <ButtonPrimary label="Logout" customMethod={logoutFunction} /> :
                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
                        <ButtonPrimary label="Sign up" customMethod={signupFunction} />
                        <ButtonPrimary label="Login" customMethod={loginFunction} />
                    </div>
            }

            <Routes>
                <Route path="/" element={<h1>Home</h1>} />
                <Route path="/profile" element={<AuthenticationGuard component={Profile} />} />
                <Route path="/callback" element={<CallBack />} />
            </Routes>
        </>
    )
}