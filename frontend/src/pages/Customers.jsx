import React, { useEffect, useState, useContext } from "react";
import { FaArrowLeft, FaSignOutAlt, FaTrashAlt, FaEdit, FaUser } from "react-icons/fa";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Customers = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phoneNumber: "" });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [message, setMessage] = useState("");

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/customers", { headers: { Authorization: `Bearer ${token}` } });
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchCustomers();
  }, [token]);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/customers", newCustomer, { headers: { Authorization: `Bearer ${token}` } });
      setCustomers((prev) => [...prev, res.data]);
      setNewCustomer({ name: "", email: "", phoneNumber: "" });
      setMessage("✅ Kunde erfolgreich hinzugefügt!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Fehler beim Hinzufügen!");
    }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/customers/${editingCustomer.id}`, editingCustomer, { headers: { Authorization: `Bearer ${token}` } });
      setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? res.data : c)));
      setEditingCustomer(null);
      setMessage("✅ Kunde erfolgreich bearbeitet!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Fehler beim Bearbeiten!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Möchtest du diesen Kunden wirklich löschen?")) {
      try {
        await api.delete(`/api/customers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setCustomers(customers.filter((c) => c.id !== id));
      } catch (err) {
        console.error(err);
        setMessage("❌ Fehler beim Löschen!");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={handleBack} className="flex items-center gap-2 text-gray-700 hover:text-blue-700 transition">
          <FaArrowLeft size={20} />
          <span className="font-medium">Zurück</span>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 text-center flex-1">
          👤 Kundenübersicht 👤
        </h2>

        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition">
          <span className="font-medium">Logout</span>
          <FaSignOutAlt size={20} />
        </button>
      </div>

      {/* Nachricht */}
      {message && (
        <div className="mb-4 p-3 bg-white shadow-md rounded-lg text-center text-gray-800 w-full max-w-4xl">
          {message}
        </div>
      )}

      {/* Kunden-Tabelle */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaUser className="text-blue-600" />
          Kunden
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">E-Mail</th>
              <th className="p-3 border">Telefon</th>
              <th className="p-3 border">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <tr key={c.id} className="text-center hover:bg-blue-50">
                  <td className="border p-2">{c.id}</td>
                  <td className="border p-2">{c.name}</td>
                  <td className="border p-2">{c.email}</td>
                  <td className="border p-2">{c.phoneNumber}</td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => setEditingCustomer({ ...c })}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-lg transition-transform transform hover:scale-105"
                      title="Bearbeiten"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-transform transform hover:scale-105"
                      title="Löschen"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  Keine Kunden vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formular */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          {editingCustomer ? "Kunden bearbeiten" : "Neuen Kunden hinzufügen"}
        </h3>
        <form onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={editingCustomer ? editingCustomer.name : newCustomer.name}
            onChange={(e) =>
              editingCustomer
                ? setEditingCustomer({ ...editingCustomer, name: e.target.value })
                : setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            required
            className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={editingCustomer ? editingCustomer.email : newCustomer.email}
            onChange={(e) =>
              editingCustomer
                ? setEditingCustomer({ ...editingCustomer, email: e.target.value })
                : setNewCustomer({ ...newCustomer, email: e.target.value })
            }
            required
            className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Telefon"
            value={editingCustomer ? editingCustomer.phoneNumber : newCustomer.phoneNumber}
            onChange={(e) =>
              editingCustomer
                ? setEditingCustomer({ ...editingCustomer, phoneNumber: e.target.value })
                : setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })
            }
            required
            className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
<div className="flex justify-center gap-4 mt-4">
  <button
    type="submit"
    className={`${ editingCustomer ? "flex-1" : "w-full"} w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition`}> {editingCustomer ? "Speichern" : "Kunden anlegen"}
  </button>

  {editingCustomer && (
    <button
      type="button"
      onClick={() => setEditingCustomer(null)}
      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg hover:bg-blue-700 transition"
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