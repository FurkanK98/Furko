import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path="/customers" element={<ProtectedRoute><Customers/></ProtectedRoute>}/>
          <Route path="/invoices" element={<ProtectedRoute><Invoices/></ProtectedRoute>}/>
          <Route path="/payments" element={<ProtectedRoute><Payments/></ProtectedRoute>}/>
          <Route path="*" element={<Login />} /> {/* Fallback */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;