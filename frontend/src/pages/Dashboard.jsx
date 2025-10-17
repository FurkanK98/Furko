import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../index.css';
import logo from "../assets/logo.png";

const Dashboard = () => {
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const buttons = [
        {label: "👤 Kunden", path: "/customers", color: "bg-blue-500 hover:bg-blue-600"},
        {label: "📄 Rechnungen", path: "/invoices", color: "bg-yellow-500 hover:bg-yellow-500"},
        {label: "💰 Zahlungen", path: "/payments", color: "bg-green-500 hover:bg-green-600"},
    ];

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100 font-sans">
            {/*Kopfzeile*/}
            <header className="w-full flex justify-between items-center px-10 py-4 bg-white shadow-md fixed top-0 z-10">
                <div className="flex-1"/>
                <div className="flex-1 flex justify-center">
                    <img src={logo} alt="Logo" className="h-16 object-contain"/>
                </div>

                <div className="flex-1 flex justify-end">
                    <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition"> Logout</button>
                </div>
            </header>

            {/*Hauptteil*/}
            <main className="flex flex-1 flex-wrap justify-center items-center gap-10 mt-40"> {
                buttons.map((btn) => (
                    <button key={btn.path} onClick={() => navigate(btn.path)} className={`${btn.color} text-white text-lg font-bold py-6 px-10 rounded-2xl shadow-md transform transition hover:scale-105`}>
                        {btn.label}
                    </button>
                ))}
            </main>

            {/*Fußzeile*/}
            <footer className="text-center py-4 text-gray-500 text-sn">
                (c) {new Date().getFullYear()} Furko - Dein FiBu-System
            </footer>
        </div>
    );
};

export default Dashboard;