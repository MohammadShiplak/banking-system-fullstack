import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Add from "./Components/Component/Clients/Add";
import Edit from "./Components/Component/Clients/Edit";
import LoginForm from "./Components/Component/Login/Login";
import Main from "./Components/Main/Main";
import ListUsers from "./Components/Component/Users/ListUsers";
import ListClients from "./Components/Component/Clients/ListClients";
import EditUser from "./Components/Component/Users/EditUser";
import { ToastProvider } from "./Components/Component/contexts/ToastContext";
import Forbidden from "./Components/Component/pages/Forbidden";
import ProtectedRoute from "./Components/ProtectedRoute";
import InertUsers from "./Components/Component/Users/InertUsers";
import { useEffect } from "react";
import RegisterForm from "./Components/Component/Login/handleRegister";
function App() {
  useEffect(() => {
    // ─────────────────────────────────────────
    // Listen for navigation events fired by axiosInstance
    // When interceptor wants to redirect → it fires "navigate" event
    // We catch it here and use React Router to navigate safely
    // ─────────────────────────────────────────
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const path = customEvent.detail?.path;

      console.log("🧭 Navigation event received:", path);

      if (path) {
        Navigate(path); // ✅ React Router navigate — safe!
      }
    };

    // Start listening for the "navigate" event
    window.addEventListener("navigate", handleNavigate);

    // ✅ Cleanup — stop listening when component unmounts
    // Prevents memory leaks
    return () => {
      window.removeEventListener("navigate", handleNavigate);
    };
  }, [Navigate]); // re-run if navigate changes
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true, // ✅ no more warning 1
        v7_relativeSplatPath: true, // ✅ no more warning 2
      }}
    >
      <ToastProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/Forbidden" element={<Forbidden />} />
            <Route path="/Main" element={<Main />} />
            <Route path="/Register" element={<RegisterForm />} />

            <Route path="/Add" element={<Add />} />
            <Route path="/Edit/:Id" element={<Edit />} />
            <Route path="/AddUser" element={<InertUsers />} />

            <Route
              path="/ListUsers"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <ListUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ListClients"
              element={
                <ProtectedRoute>
                  <ListClients />
                </ProtectedRoute>
              }
            />

            <Route path="/EditUser/:Id" element={<EditUser />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
