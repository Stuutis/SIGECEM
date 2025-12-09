import React, { useState, useEffect } from "react";
import { api } from "../api";

export default function Relatorios() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getDashboard();
      if (!data) {
        setError("Nenhum dado de resumo geral retornado pelo servidor.");
        setItens([]);
        return;
      }

      setItens([
        {
          titulo: "Resumo geral do sistema",
          periodo: "Atual",
          ...data,
        },
      ]);
    } catch (err) {
      console.error("Erro ao carregar relatórios:", err);
      setError("Falha ao carregar dados do dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Função genérica para download de arquivos (PDF ou Excel)
  async function baixarArquivo(tipo) {
    try {
      const url = `${api.BASE_URL}/api/relatorios/exportar/${tipo}`;
      const res = await fetch(url, {
        method: "GET",
      });

      if (!res.ok) throw new Error("Falha ao gerar arquivo");

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      // Define o nome do arquivo
      link.download = tipo === "pdf" ? "relatorio_geral.pdf" : "resumo_geral.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error(err);
      alert(`Erro ao baixar ${tipo.toUpperCase()}. Veja o console.`);
    }
  }

  const thStyle = { border: "1px solid #ccc", padding: 8, backgroundColor: "#f0f0f0", textAlign: "left" };
  const tdStyle = { border: "1px solid #ccc", padding: 8 };
  const btnStyle = { padding: "5px 10px", margin: "2px", cursor: "pointer" };

  return (
    <div style={{ padding: 20 }}>
      <h1>Relatórios</h1>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {!loading && itens.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
          <thead>
            <tr>
              <th style={thStyle}>Título</th>
              <th style={thStyle}>Período</th>
              <th style={thStyle}>Doadores</th>
              <th style={thStyle}>Famílias</th>
              <th style={thStyle}>Itens em Estoque</th>
              <th style={thStyle}>Campanhas</th>
              <th style={thStyle}>Exportar</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((r, i) => (
              <tr key={i}>
                <td style={tdStyle}>{r.titulo}</td>
                <td style={tdStyle}>{r.periodo}</td>
                <td style={tdStyle}>{r.total_doadores}</td>
                <td style={tdStyle}>{r.total_familias}</td>
                <td style={tdStyle}>{r.itens_estoque}</td>
                <td style={tdStyle}>{r.campanhas_ativas}</td>
                <td style={tdStyle}>
                  <button onClick={() => baixarArquivo("pdf")} style={btnStyle}>PDF</button>
                  <button onClick={() => baixarArquivo("excel")} style={btnStyle}>Excel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
