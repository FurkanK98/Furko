import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaSignOutAlt, FaTrashAlt, FaMoneyBillWave } from "react-icons/fa";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Payments = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [newPayment, setNewPayment] = useState({
    invoiceID: "",
    amount: "",
    method: "",
  });
  const [message, setMessage] = useState("");

  // 🧾 Rechnungen abrufen (für Dropdown)
  const fetchInvoices = async () => {
    try {
      const res = await api.get("/api/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
    } catch (err) {
      console.error("Fehler beim Abrufen der Rechnungen:", err);
    }
  };

  // 💶 Zahlungen abrufen
  const fetchPayments = async () => {
    try {
      const res = await api.get("/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch (err) {
      console.error("Fehler beim Abrufen der Zahlungen:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
  }, []);

  // Neue Zahlung erstellen
  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!newPayment.invoiceID || !newPayment.amount || !newPayment.method) {
      setMessage("⚠️ Bitte alle Felder ausfüllen!");
      return;
    }

    try {
      await api.post(`/api/payments/${newPayment.invoiceID}`, {
        amount: parseFloat(newPayment.amount),
        method: newPayment.method,
      });
      setMessage("✅ Zahlung erfolgreich hinzugefügt!");
      setNewPayment({ invoiceID: "", amount: "", method: "" });
      fetchPayments();
    } catch (err) {
      console.error("Fehler beim Hinzufügen:", err);
      setMessage("❌ Fehler beim Hinzufügen der Zahlung!");
    }
  };

  // Zahlung löschen
  const handleDelete = async (id) => {
    if (window.confirm("Möchtest du diese Zahlung wirklich löschen?")) {
      try {
        await api.delete(`/api/payments/${id}`);
        setPayments(payments.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Fehler beim Löschen:", err);
      }
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Zurück zum Dashboard
  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-700 transition"
        >
          <FaArrowLeft size={20} />
          <span className="font-medium">Zurück</span>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 text-center flex-1">
          💳 Zahlungsübersicht 💳
        </h2>

        <button
          onClick={handleLogout}
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

      {/* Zahlungen-Tabelle */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaMoneyBillWave className="text-green-600" />
          Zahlungen
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Rechnung</th>
              <th className="p-3 border">Kunde</th>
              <th className="p-3 border">Betrag (€)</th>
              <th className="p-3 border">Methode</th>
              <th className="p-3 border">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.id} className="text-center hover:bg-blue-50">
                  <td className="border p-2">{p.id}</td>
                  <td className="border p-2">{p.invoice ? `#${p.invoice.id}` : "—"}</td>
                  <td className="border p-2 text-gray-800 font-medium">{p.invoice?.customer?.name ?? "—"}</td>
                  <td className="border p-2">{p.amount.toFixed(2)} €</td>
                  <td className="border p-2">{p.method}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-transform transform hover:scale-105n"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  Keine Zahlungen vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Neue Zahlung hinzufügen */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Neue Zahlung hinzufügen</h3>
        <form onSubmit={handleAddPayment} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Rechnungs-ID</label>
            <select
              value={newPayment.invoiceID}
              onChange={(e) => setNewPayment({ ...newPayment, invoiceID: e.target.value })}
              className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">-- Rechnung wählen --</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                   🧾 #{inv.id} | 👤 {inv.customer?.name ?? "Unbekannt"} | 💶 {inv.amount.toFixed(2)} € | {inv.status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Betrag (€)</label>
            <input
              type="number"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="z. B. 120.50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Zahlungsmethode</label>
            <select
              value={newPayment.method}
              onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
              className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">-- Methode wählen --</option>
              <option value="Überweisung">Überweisung</option>
              <option value="Bar">Bar</option>
              <option value="Kreditkarte">Kreditkarte</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Zahlung hinzufügen
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payments;