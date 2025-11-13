import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Beneficiarios from "./pages/Beneficiarios";
import Campanhas from "./pages/Campanhas";
import Relatorios from "./pages/Relatorios";
import Doadores from "./pages/Doadores";
import Familias from "./pages/Familias";
import Estoque from "./pages/Estoque";
import "./styles.css";

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>SIGECEM</h2>
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/beneficiarios">Beneficiários</Link></li>
            <li><Link to="/campanhas">Campanhas</Link></li>
            <li><Link to="/doadores">Doadores</Link></li>
            <li><Link to="/familias">Famílias</Link></li>
            <li><Link to="/estoque">Estoque</Link></li>
            <li><Link to="/relatorios">Relatórios</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/beneficiarios" element={<Beneficiarios />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/doadores" element={<Doadores />} />
          <Route path="/familias" element={<Familias />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </main>
    </div>
  );
}
