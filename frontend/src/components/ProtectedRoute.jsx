import React, { useContext } from "react"; // React & useContext importieren
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom"; // Für Redirect, wenn man nicht eingeloggt ist

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext); // Token holen

    if(!token) {
        return <Navigate to = "/login" />; // Wenn kein Token vorhanden ist, weiterleitung zur Login-Seite
    }
    return children; // Sonst: Die geschützte Seite rendern
}

export default ProtectedRoute;