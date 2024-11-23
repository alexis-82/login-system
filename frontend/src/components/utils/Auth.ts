import { NavigateFunction } from "react-router-dom";

export const logout = (navigate: NavigateFunction) => {
    localStorage.clear()
    navigate('/')
}