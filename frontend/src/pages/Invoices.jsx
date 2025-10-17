import React, { useEffect, useState, useContext } from "react";
import { FaArrowLeft, FaSignOutAlt, FaCheck, FaTrash, FaFileInvoice } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";

const Invoices = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newInvoice, setNewInvoice] = useState({ customerId: "", amount: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!token) return;
      try {
        const [invoiceRes, customerRes] = await Promise.all([
          api.get("/api/invoices", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/api/customers", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setInvoices(invoiceRes.data);
        setCustomers(customerRes.data);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [token, logout]);

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/api/invoices/${newInvoice.customerId}`, {
        amount: parseFloat(newInvoice.amount),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices((prev) => [...prev, response.data]);
      setMessage("✅ Rechnung erfolgreich erstellt!");
      setNewInvoice({ customerId: "", amount: "" });
    } catch (err) {
      console.error("Fehler beim Erstellen:", err);
      setMessage("❌ Fehler beim Erstellen!");
    }
  };

  const handlePayInvoice = async (id) => {
    try {
      const response = await api.put(`/api/invoices/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(prev => prev.map(inv => (inv.id === id ? response.data : inv)));
      setMessage("✅ Rechnung bezahlt!");
    } catch (err) {
      console.error("Fehler beim Bezahlen:", err);
      setMessage("❌ Fehler beim Bezahlen!");
    }
  };

  const handleDeleteInvoice = async (id) => {
    try {
      await api.delete(`/api/invoices/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      setMessage("✅ Rechnung gelöscht!");
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
      setMessage("❌ Fehler beim Löschen!");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
        <p className="text-blue-700 text-lg">Lade Rechnungen...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-700 transition"
        >
          <FaArrowLeft size={20} />
          <span className="font-medium">Zurück</span>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 text-center flex-1">
          🧾 Rechnungsübersicht 🧾
        </h2>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
        >
          <span className="font-medium">Logout</span>
          <FaSignOutAlt size={20} />
        </button>
      </div>

      {/* Meldung */}
      {message && (
        <div className="mb-4 p-3 bg-white shadow-md rounded-lg text-center text-gray-800">
          {message}
        </div>
      )}

      {/* Rechnungen-Tabelle */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaFileInvoice className="text-blue-600" />
          Rechnungen
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Kunde</th>
              <th className="p-3 border">Betrag (€)</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((inv) => (
                <tr key={inv.id} className="text-center hover:bg-blue-50">
                  <td className="border p-2">{inv.id}</td>
                  <td className="border p-2 text-gray-800 font-medium">{inv.customer?.name}</td>
                  <td className="border p-2">{inv.amount.toFixed(2)} €</td>
                  <td className="border p-2">{inv.status}</td>
                  <td className="border p-2 flex justify-center gap-2">
                    {inv.status === "OPEN" && (
                      <button
                        onClick={() => handlePayInvoice(inv.id)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-transform transform hover:scale-105"
                        title="Rechnung bezahlen"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteInvoice(inv.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-transform transform hover:scale-105"
                      title="Rechnung löschen"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  Keine Rechnungen vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Neue Rechnung erstellen */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Neue Rechnung erstellen</h3>
        <form onSubmit={handleAddInvoice} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Kunde</label>
            <select
              required
              value={newInvoice.customerId}
              onChange={(e) => setNewInvoice({ ...newInvoice, customerId: e.target.value })}
              className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Kunden auswählen</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Betrag (€)</label>
            <input
              type="number"
              placeholder="z. B. 120.50"
              value={newInvoice.amount}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
              required
              className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Rechnung erstellen
          </button>
        </form>
      </div>
    </div>
  );
};

export default Invoices;