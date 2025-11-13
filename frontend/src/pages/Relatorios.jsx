// src/pages/Relatorios.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api";

const ENTITY = "relatorios";

export default function Relatorios() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await api.list(ENTITY);
      setItens(data || [
        // placeholder se backend não existir ainda
        { id: "mensal", titulo: "Relatório Mensal", periodo: "Outubro / 2025" },
        { id: "anual", titulo: "Relatório Anual", periodo: "2025" },
      ]);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function handleExport(id) {
    // exemplo: abrir endpoint de exportação
    window.open(`${api.BASE_URL || ""}/api/${ENTITY}/${id}/export`, "_blank");
  }

  return (
    <div>
      <h1>Relatórios</h1>
      <div className="content-container">
        {loading ? <p>Carregando...</p> : (
          <table className="tabela">
            <thead><tr><th>Título</th><th>Período</th><th>Exportar</th></tr></thead>
            <tbody>
              {itens.map(r => (
                <tr key={r.id || r.titulo}>
                  <td>{r.titulo}</td>
                  <td>{r.periodo}</td>
                  <td><button onClick={() => handleExport(r.id)}>PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
