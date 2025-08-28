import React, { createContext, useState, useEffect } from "react"; // React-Hooks & Context
import api from "../api/api"; // API-Client importieren


// Context erstellen -> Stellt Login-Infos global zur Verfügung
export const AuthContext = createContext();

// Provider-Komponente -> Wickelt die App ein & gibt Auth-Daten weiter
export const AuthProvider = ({ children }) => {
    const[token, setToken] = useState(localStorage.getItem("token") || null); // State: Speichert JWT-Token
    const[user, setUser] = useState(null); // State: Speichert User-Daten (optional)

    // Login-Funktion: Ruft Backend auf
    const login = async (username, password) => {
        try {
            // Anfrage an Backend
            const response = await api.post("/api/login", {username, password});

            // Token aus Response nehmen
            const newToken = response.data.token; // Token aus Antwort holen

            // Token speichern
            localStorage.setItem("token", newToken); // Token speichern
            setToken(newToken); // State aktualisieren

            // Benutzerinfos
            if(response.data.token) setUser(response.data.token)

            return true;
        } catch(error) {
            console.error("Login fehlgeschlagen: ", error);
            return false; // Login fehlgeschlagen
        }
    };

    // Logout-Funktion
    const logout = () => {
        localStorage.removeItem("token"); // Token löschen
        setToken(null); // State zurücksetzen
        setUser(null); // User zurücksetzen
    };

    useEffect(() => {
        if (token) console.log("Token gesetzt: ", token);
    }, [token]);

    return (
        <AuthContext.Provider value = {{ token, user, login, logout }}>
            { children }
        </AuthContext.Provider>
    );
};