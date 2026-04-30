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
function App() {
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
