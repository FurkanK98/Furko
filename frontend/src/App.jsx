import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/customers" element={<ProtectedRoute><Customers/></ProtectedRoute>}/>
          <Route path="*" element={<Login />} /> {/* Fallback */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;