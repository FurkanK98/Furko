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
            navigate("/dashboard"); // Bei Erfolg -> zur Kundenübersicht
        } else {
            setError("Login fehlgeschlagen. Bitte überprüfe deine Daten");
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          ⭐ Furko – Login ⭐
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Passwort:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-red-500 mt-4 text-center font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login; // Komponente exportieren