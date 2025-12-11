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
      const blob = await api.download(`/api/relatorios/exportar/${tipo}`);

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = tipo === "pdf" ? "relatorio_geral.pdf" : "resumo_geral.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);

      console.log(`✅ Download de ${tipo.toUpperCase()} concluído!`);
    } catch (err) {
      console.error("Erro ao baixar arquivo:", err);
      alert(`Erro ao baixar ${tipo.toUpperCase()}. Veja o console.`);
    }
  }

  const btnStyle = { padding: "5px 10px", margin: "2px", cursor: "pointer" };

return (
  <>
    <h1>Relatórios</h1>

    <div className="content-container">

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {!loading && itens.length > 0 && (
        <table className="tabela">
          <thead>
            <tr>
              <th>Título</th>
              <th>Período</th>
              <th>Doadores</th>
              <th>Famílias</th>
              <th>Itens em Estoque</th>
              <th>Campanhas</th>
              <th>Exportar</th>
            </tr>
          </thead>

          <tbody>
            {itens.map((r, i) => (
              <tr key={i}>
                <td>{r.titulo}</td>
                <td>{r.periodo}</td>
                <td>{r.total_doadores}</td>
                <td>{r.total_familias}</td>
                <td>{r.itens_estoque}</td>
                <td>{r.campanhas_ativas}</td>
                <td>
                  <button onClick={() => baixarArquivo("pdf")}>PDF</button>
                  <button onClick={() => baixarArquivo("excel")}>Excel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  </>
);
}
