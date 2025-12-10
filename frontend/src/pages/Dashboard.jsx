import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [resumo, setResumo] = useState({
    total_doadores: 0,
    total_familias: 0,
    itens_estoque: 0,
    campanhas_ativas: 0
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getDashboard();
        if (data) setResumo(data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="cards-container">
        <div className="card azul-escuro">
          <h2>Doadores Cadastrados</h2>
          <p>{resumo.total_doadores}</p>
        </div>

        <div className="card verde">
          <h2>Itens em Estoque</h2>
          <p>{resumo.itens_estoque}</p>
        </div>

        <div className="card azul-claro">
          <h2>Famílias Cadastradas</h2>
          <p>{resumo.total_familias}</p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #e67e22, #d35400)' }}>
           <h2>Campanhas Ativas</h2>
           <p>{resumo.campanhas_ativas}</p>
        </div>
      </div>
    </div>
  );
}
