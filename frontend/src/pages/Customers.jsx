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
            try {
                const respoWnse = await api.get("/api/customers", {
                    headers: { Authorization: 'Bearer ${token}' }
                }); // GET /api/customers
                setCustomers(response.data); // Kunden speichern
            } catch (error) {
                console.error("Fehler beim Laden der Kunden: ", error);
                logout(); // Wenn Token ungültig ist, wird Logout erzwungen
            } finally {
                setLoading(false);
            }
            if (token) fetchCustomers();
        };
    }, [token, logout]);

    // Formular abschicken
    const handleAddCustomer = async (e) => {
        e.preventDefault();
        
        try {
            const response = await api.post("/customers", newCustomer, {
                headers: { Authorization: 'Bearer ${token}' },
            });

            // Neuen Kunden direkt in die Liste hinzufügen
            setCustomers([...customers, response.data]);
            setMessage("Kunde wurde erfolgreich hinzugefügt!");

            // Formular zurücksetzen
            setNewCustomer({name: "", email: "", phoneNumber: ""});
        } catch (err) {
            console.error("Fehler beim hinzufügen: ", err);
            setMessage("Fehler beim hinzufügen!");
        }
    }


    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        try {
            const reponse = await api.put('/api/customers/${editingCustomer.id}', editingCustomer, {
                headers: { Authorization: 'Bearer ${token}'},
            });

            // Liste aktualisieren
            setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? response.data : c)));
            setMessage("Kunde wurde erfolgreich bearbeitet!");

            // Reset
            setEditingCustomer(null);
        } catch (err) {
            console.error("Fehler beim ändern: ", err);
            setMessage("Fehler beim ändern!");
        }
    }


    const deleteCustomer = async (id) => {
        try  {
            await api.delete('/api/customers/${id}', {
                headers: { Authorization: 'Bearer ${token}'},
            });

            setCustomers((prev) => prev.filter((c) => c.id !== id)); // prev = Komplette Kundenliste anzeigen, bevor er überschrieben wird.
            setMessage("Kunde wurde erfolgreich gelöscht!");
        } catch (err) {
            console.error("Fehler beim löschen: ", err);
            setMessage("Fehler beim löschen!");
        }
    }

    if (loading) return <p>Lade Kunden ...</p>;

    return(
        <div style={{ maxWidth: "600px", margin: "auto", marginTop: "50px"}}>
            <h2>Kundenübersicht</h2>
            <button onClick={logout} style={{marginBottom: "20px"}}>Logout</button>
            {
            customers.length === 0 ? (<p> Keine Kunden gefunden.</p>) : (
                <>
                <table border="1" cellPadding="8" style={{width: "100%", textAlign: "left"}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>E-Mail</th>
                            <th>Telefon-Nr.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.name}</td>
                                <td>{c.email}</td>
                                <td>{c.phoneNumber}</td>
                                <td>
                                    <button onClick={() => setEditingCustomer(c)}>Bearbeiten</button>
                                    <button onClick={() => deleteCustomer(c.id)}>Löschen</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </>
            )
            }
                

            <h3>Neuen Kunden hinzufügen</h3>
            {message && <p style={{color: message.startsWith("Kunde") ? "green" : "red"}}>{message}</p> }
            <form onSubmit={handleAddCustomer}>
                <div>
                    <label>Name:</label><br/>
                        <input type="text" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} required/>
                </div>
                <div>
                    <label>E-Mail</label><br/>
                    <input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} required/>
                </div>
                <div>
                    <label>Telefon-Nr.:</label><br/>
                    <input type="text" value={newCustomer.phoneNumber} onChange={(e) => setNewCustomer({...newCustomer, phoneNumber: e.target.value})} required/>
                </div>
                <button type="submit">Speichern</button>
            </form>
            


            { editingCustomer && (
                <div style={{marginTop: "30px"}}>
                    <h3>Kunden bearbeiten</h3>
                    {message && <p style={{color: message.startsWith("Kunde") ? "green" : "red"}}>{message}</p> }
                    <form onSubmit={handleUpdateCustomer}>
                        <div>
                            <label>Name:</label><br/>
                            <input type="test" value={editingCustomer.name} onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})} required/>
                        </div>

                        <div>
                            <label>E-Mail:</label><br/>
                            <input type="email" value={editingCustomer.email} onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})} required/>
                        </div>

                        <div
                        ><label>Telefon-Nr.:</label><br/>
                        <input type="text" value={editingCustomer.phoneNumber} onChange={(e) => ({editingCustomer, email: e.target.value})} required/>
                        </div>
                        <button type="submit">Änderung speichern</button>
                        <button type="button" onClick={() => setEditingCustomer(null)} style={{marginLeft: "10px"}}>Abbrechen</button>
                    </form>
                </div>
            )}


            <h3>Kunden löschen</h3>
            {message && <p style={{color: message.startsWith("Kunde") ? "green" : "red"}}>{message}</p> }
            <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "left"}}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>E-Mail</th>
                        <th>Telefon-Nr.</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((c) => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.name}</td>
                            <td>{c.email}</td>
                            <td>{c.phoneNumber}</td>
                            <td>
                                <button onClick={() => deleteCustomer(c.id)}>Löschen</button>
                                <button type="button" onClick={() => deleteCustomer(null)} style={{marginleft: "10px"}}>Abbrechen</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Customers;