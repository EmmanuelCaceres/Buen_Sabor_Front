import { ButtonPrimary } from "../ButtonPrimary/ButtonPrimary"
import { useAuth0 } from "@auth0/auth0-react"

export const Header = () => {
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
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <ButtonPrimary label="Sign up" customMethod={signupFunction} />
                        <ButtonPrimary label="Login" customMethod={loginFunction} />
                    </div>
            }
        </>

    )
}