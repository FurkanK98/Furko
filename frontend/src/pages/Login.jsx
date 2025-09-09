import React, { useState, useContext } from "react"; // useState für Inputs, useContext für Auth
import { AuthContext } from "../context/AuthContext"; // AuthContext importieren
import { useNavigate } from "react-router-dom"; // für Redirect nach Login

const Login = () => {
    const { login } = useContext(AuthContext); // login()-Methode aus dem AuthContext holen
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Navigation nach erfolgreichem Login

    const handleSubmit = async (e) => {
        e.preventDefault(); // Verhindert Standard-Neuladen der Seite

        const success = await login(username, password); // Login-Funktion aufrufen

        if(success) {
            navigate("/customers"); // Bei Erfolg -> zur Kundenübersicht
        } else {
            setError("Login fehlgeschlagen. Bitte überprüfe deine Daten");
        }
    };

 return (
        <div
            style={{
                minHeight: "100vh",   // volle Höhe des Fensters
                minWidth: "100vw",    // volle Breite des Fensters
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ecf0f1", // hellgrau
            }}
        >
            <div
                style={{
                    backgroundColor: "#ecf0f1",
                    padding: "40px",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ marginBottom: "20px", textAlign: "center", color: "#2c3e50" }}>
                    ⭐ Furko – Login ⭐
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "15px", textAlign: "left" }}>
                        <label style={{ color: "#2c3e50", fontWeight: "bold" }}>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: "92%",
                                padding: "10px",
                                marginTop: "5px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "20px", textAlign: "left" }}>
                        <label style={{ color: "#2c3e50", fontWeight: "bold" }}>Passwort:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "92%",
                                padding: "10px",
                                marginTop: "5px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#3498db",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Login
                    </button>
                </form>

                {error && (
                    <p style={{ color: "red", marginTop: "15px" }}>{error}</p>
                )}
            </div>
        </div>
    );
};

export default Login; // Komponente exportieren