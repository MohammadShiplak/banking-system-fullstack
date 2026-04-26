import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Add from "./Components/Component/Clients/Add";
import Edit from "./Components/Component/Clients/Edit";
import LoginForm from "./Components/Component/Login/Login";
import Main from "./Components/Main/Main";
import AddUser from "./Components/Component/Users/AddUser";
import ListUsers from "./Components/Component/Users/ListUsers";
import ListClients from "./Components/Component/Clients/ListClients";
import EditUser from "./Components/Component/Users/EditUser";
import { ToastProvider } from "./Components/Component/contexts/ToastContext";

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
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/Main" element={<Main />} />

            <Route path="/Add" element={<Add />} />
            <Route path="/Edit/:Id" element={<Edit />} />
            <Route path="/AddUser" element={<AddUser />} />
            <Route path="/ListUsers" element={<ListUsers />} />
            <Route path="/ListClients" element={<ListClients />} />
            <Route path="/EditUser/:Id" element={<EditUser />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
