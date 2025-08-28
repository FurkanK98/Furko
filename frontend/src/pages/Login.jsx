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
        <div style={{ maxWidth: "300px", margin:"auto", marginTop:"100px" }}>
            <h2>Furko - Login</h2>
            <form onSubmit = {handleSubmit}>
                <div>
                    <label>Username:</label><br/>
                    <input type="name" value={username} onChange={(e) => setUsername(e.target.value)} />

                </div>
                <div>
                    <label>Passwort:</label><br/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>

            {
            error && <p style = {{ color: "red"}}>{error}</p> // Wir nur angezeigt, wenn "error" nicht null/leer ist
            }
        </div>
    );
};

export default Login; // Komponente exportieren