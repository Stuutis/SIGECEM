import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Beneficiarios from "./pages/Beneficiarios";
import Campanhas from "./pages/Campanhas";
import Relatorios from "./pages/Relatorios";
import Doadores from "./pages/Doadores";
import Familias from "./pages/Familias";
import Estoque from "./pages/Estoque";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles.css";

// Componente que protege rotas privadas
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// Componente de Layout (Sidebar + Conteúdo)
// Só usamos ele quando o usuário está logado
function Layout({ children }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>SIGECEM</h2>
        <nav>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/beneficiarios">Beneficiários</Link>
            </li>
            <li>
              <Link to="/campanhas">Campanhas</Link>
            </li>
            <li>
              <Link to="/doadores">Doadores</Link>
            </li>
            <li>
              <Link to="/familias">Famílias</Link>
            </li>
            <li>
              <Link to="/estoque">Estoque</Link>
            </li>
            <li>
              <Link to="/relatorios">Relatórios</Link>
            </li>
          </ul>
        </nav>
        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <button
            onClick={handleLogout}
            style={{ background: "rgba(255,255,255,0.1)", width: "100%" }}
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/beneficiarios"
        element={
          <PrivateRoute>
            <Layout>
              <Beneficiarios />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/campanhas"
        element={
          <PrivateRoute>
            <Layout>
              <Campanhas />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/doadores"
        element={
          <PrivateRoute>
            <Layout>
              <Doadores />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/familias"
        element={
          <PrivateRoute>
            <Layout>
              <Familias />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/estoque"
        element={
          <PrivateRoute>
            <Layout>
              <Estoque />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/relatorios"
        element={
          <PrivateRoute>
            <Layout>
              <Relatorios />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
