import axios from "axios"; // axios importieren, um HTTP-Requests zu machen

// Basis-URL für alle API-Requests (Backend-URL)
const api = axios.create(
    {
        baseURL: "http://localhost:8080/api",
    }
);

// Request-Interceptor: Wird vor jedem Request aufgerufen
// Fügt den Authorization-Header mit JWT hinzu, wenn Token existiert
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Token aus localStorage holen

        if(token) {
            config.headers.Authorization = 'Bearer ${token}'; // Header setzen
        }
        return config; // config zurückgeben
    },
    (error) => Promise.reject(error) // Fehler weiterleiten
);

export default api; // API wir an andere Dateien freigegeben