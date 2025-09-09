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
            const response = await api.post("/api/login", {username, password}); // Anfrage an Backend
            const newToken = response.data.token; // Token aus Antwort holen

            // Token speichern
            localStorage.setItem("token", newToken); // Token speichern
            setToken(newToken); // State aktualisieren

            setUser({username, role: "ADMIN"});

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
        const savedtoken = localStorage.getItem("token");

        if(savedtoken && !token) {
            setToken(savedtoken);
            setUser({username: "persistedUser", role: "ADMIN"});
        }
    }, []);

    return (
        <AuthContext.Provider value = {{ token, user, login, logout }}>
            { children }
        </AuthContext.Provider>
    );
};