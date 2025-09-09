import React, { useEffect, useState, useContext } from "react";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";

const Customers = () => {
    const {token, logout} = useContext(AuthContext);
    const [customers, setCustomers] = useState([]); // State: Liste von Kunden
    const [newCustomer, setNewCustomer] = useState({name:"", email:"", phoneNumber:""});
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Kunden laden beim Start
    useEffect(() => {
        const fetchCustomers = async ()  => {
            if(!token) return;

            try {
                const response = await api.get(`/api/customers`, {
                    headers: { Authorization: `Bearer ${token}` }
                }); // GET /api/customers

                setCustomers(response.data); // Kunden speichern
            } catch (error) {
                console.error("Fehler beim Laden der Kunden: ", error);
                logout(); // Wenn Token ungültig ist, wird Logout erzwungen
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchCustomers();
    }, [token, logout]);

    // Formular abschicken
    const handleAddCustomer = async (e) => {
        e.preventDefault();
        
        try {
            const response = await api.post(`/api/customers`, newCustomer, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers((prev) => [...prev, response.data]);
            setMessage("Kunde wurde erfolgreich hinzugefügt!");
            setNewCustomer({name: "", email: "", phoneNumber: ""});
        } catch (err) {
            console.error("Fehler beim hinzufügen: ", err);
            setMessage("Fehler beim hinzufügen!");
        }
    };


    const handleUpdateCustomer = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(`/api/customers/${editingCustomer.id}`, editingCustomer, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? response.data : c))); // Liste aktualisieren
            setMessage("Kunde wurde erfolgreich bearbeitet!");
            setEditingCustomer(null);
        } catch (err) {
            console.error("Fehler beim ändern: ", err);
            setMessage("Fehler beim ändern!");
        }
    };


    const deleteCustomer = async (id) => {
        try  {
            await api.delete(`/api/customers/${id}`, {
                headers: { Authorization: `Bearer ${token}`}
            });
            setCustomers((prev) => prev.filter(c => c.id !== id)); // prev = Komplette Kundenliste anzeigen, bevor er überschrieben wird.
            setMessage("Kunde wurde erfolgreich gelöscht!");
        } catch (err) {
            console.error("Fehler beim löschen: ", err);
            setMessage("Fehler beim löschen!");
        }
    };

    if (!loading) return(
        <div style={{ minHeight: "100vh", minWidth: "100vw", width:"100%", display: "flex", justifyContent: "center", alignItems: "flex-start", backgroundColor: "#ecf0f1", fontFamily: "Arial, sans-serif"}}>
            <div 
                style={{
                width: "90%",
                maxWidth: 900,
                backgroundColor: "#fff",
                padding: 24,
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                position: "center",
                textAlign: "center",
                margin: "250px"
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ color: "#2c3e50", textAlign: "center", flex: 1 }}>⭐ Kundenübersicht ⭐</h2>
                <button
                    onClick={logout}
                    style={{
                    padding: "8px 12px",
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    }}
                >
                    Logout
                </button>
                </div>

        {message && (
            <p style={{ color: message.startsWith("Kunde") ? "green" : "red", textAlign: "center" }}>{message}</p>
        )}

        {/* Tabelle */}
        {customers.length === 0 ? (
            <p>Keine Kunden gefunden.</p>
        ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
                <tr style={{ backgroundColor: "#34495e", color: "#fff" }}>
                <th style={{ padding: 8, textAlign: "center" }}>ID</th>
                <th style={{ padding: 8, textAlign: "center" }}>Name</th>
                <th style={{ padding: 8, textAlign: "center" }}>E-Mail</th>
                <th style={{ padding: 8, textAlign: "center" }}>Telefon-Nr.</th>
                <th style={{ padding: 8, textAlign: "center" }}>Aktionen</th>
                </tr>
            </thead>
            <tbody>
                {customers.map((c) => (
                console.log(c),
                <tr key={c.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ color: "#34495e", padding: 8, textAlign: "center" }}>{c.id}</td>
                    <td style={{ color: "#34495e", padding: 8, textAlign: "center" }}>{c.name}</td>
                    <td style={{ color: "#34495e", padding: 8, textAlign: "center" }}>{c.email}</td>
                    <td style={{ color: "#34495e", padding: 8, textAlign: "center" }}>{c.phoneNumber}</td>
                    <td style={{ color: "#34495e", padding: 8, textAlign: "center" }}>
                    <button
                        onClick={() => setEditingCustomer({ ...c })}
                        style={{
                        marginRight: 8,
                        padding: "4px 8px",
                        backgroundColor: "#f1c40f",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        }}>Bearbeiten</button>
                    <button
                        onClick={() => deleteCustomer(c.id)}
                        style={{
                        padding: "4px 8px",
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        }}>Löschen</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}

        {/* EIN Formular – nutzt deine Methoden */}
        <h3>{editingCustomer ? "Kunden bearbeiten" : "Neuen Kunden hinzufügen"}</h3>
        <form
            onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
            style={{ marginBottom: 40 }}
        >
            <div style={{ marginBottom: 10, color: "#34495e", textAlign: "center" }}>
            <label>Name</label>
            <br />
            <input
                type="text"
                value={editingCustomer ? editingCustomer.name : newCustomer.name}
                onChange={(e) =>
                editingCustomer
                    ? setEditingCustomer({ ...editingCustomer, name: e.target.value })
                    : setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                required
                style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc", textAlign: "center" }}
            />
            </div>

            <div style={{ marginBottom: 10, color: "#34495e", textAlign: "center" }}>
            <label>E-Mail</label>
            <br />
            <input
                type="email"
                value={editingCustomer ? editingCustomer.email : newCustomer.email}
                onChange={(e) =>
                editingCustomer
                    ? setEditingCustomer({ ...editingCustomer, email: e.target.value })
                    : setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                required
                style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc", textAlign: "center" }}
            />
            </div>

            <div style={{ marginBottom: 10, color: "#34495e", textAlign: "center" }}>
            <label>Telefon-Nr.</label>
            <br />
            <input
                type="text"
                value={editingCustomer ? editingCustomer.phoneNumber : newCustomer.phoneNumber}
                onChange={(e) =>
                editingCustomer
                    ? setEditingCustomer({ ...editingCustomer, phoneNumber: e.target.value })
                    : setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })
                }
                required
                style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc", textAlign: "center" }}
            />
            </div>

            <div style={{ textAlign: "center"}}>
                <button
                type="submit"
                style={{
                    padding: "8px 12px",
                    backgroundColor: "#2ecc71",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                }}
                >
                {editingCustomer ? "Speichern" : "Hinzufügen"}
                </button>

                {editingCustomer && (
                <button
                    type="button"
                    onClick={() => setEditingCustomer(null)}
                    style={{
                    marginLeft: 10,
                    padding: "8px 12px",
                    backgroundColor: "#95a5a6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer"
                    }}
                >
                    Abbrechen
                </button>
            )}
            </div>
        </form>
        </div>
    </div>
  );
};

export default Customers;