import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Beneficiarios from "./pages/Beneficiarios"
import Doadores from "./pages/Doadores";
import Familias from "./pages/Familias";
import Estoque from "./pages/Estoque";
import Campanhas from "./pages/Campanhas";
import Relatorios from "./pages/Relatorios";

import "./style.css"; // garante o CSS

function App() {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/doadores" element={<Doadores />} />
          <Route path="/beneficiarios" element={<Beneficiarios />} />
          <Route path="/familias" element={<Familias />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
