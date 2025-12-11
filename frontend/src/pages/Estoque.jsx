import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api";

export default function Estoque() {
  const userIsAdmin = true;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const data = await api.list("estoque");
      setItems(data || []);
    } catch (err) {
      console.error("Erro ao carregar estoque:", err);
      alert("Erro ao carregar estoque. Veja o console.");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(payload) {
    try {
      if (payload.id) {
        await api.update("estoque", payload.id, payload);
      } else {
        await api.create("estoque", payload);
      }

      setShowForm(false);
      setEditing(null);
      load();
    } catch (e) {
      console.error("Erro ao salvar:", e);
      alert("Erro ao salvar o produto.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Confirmar exclusão?")) return;

    try {
      await api.remove("estoque", id);
      load();
    } catch (e) {
      console.error("Erro ao remover:", e);
      alert("Erro ao remover produto.");
    }
  }

  return (
    <div>
      <h1>Estoque / Produtos</h1>

      <div className="content-container">
        {userIsAdmin && (
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            + Adicionar Produto
          </button>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.produto}</td>
                  <td>{it.quantidade}</td>
                  <td>{it.categoria}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditing(it);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </button>

                    <button
                      style={{
                        marginLeft: 10,
                        backgroundColor: "#c0392b",
                        color: "white",
                      }}
                      onClick={() => handleDelete(it.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={4}>Nenhum produto cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <Form
          initial={editing || {}}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

//
// ============= FORM CORRIGIDO =================
//
function Form({ initial = {}, onCancel, onSave }) {
  const empty = { produto: "", quantidade: 0, categoria: "" };
  const [f, setF] = useState({ ...empty, ...initial });

  useEffect(() => {
    setF({ ...empty, ...initial });
  }, [initial]);

  function change(e) {
    const { name, value } = e.target;
    setF((p) => ({ ...p, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!f.produto.trim()) return alert("Informe o nome do produto!");
    onSave(f);
  }

  return (
    <div className="modal">
      <form className="modal-card" onSubmit={submit}>
        <h3>{initial.id ? "Editar Produto" : "Novo Produto"}</h3>

        <label>
          Produto
          <input name="produto" value={f.produto} onChange={change} />
        </label>

        <label>
          Quantidade
          <input
            name="quantidade"
            type="number"
            value={f.quantidade}
            onChange={change}
          />
        </label>

        <label>
          Categoria
          <input
            name="categoria"
            value={f.categoria}
            onChange={change}
            placeholder="Ex: Alimentos, Higiene, etc"
          />
        </label>

        <div className="modal-actions">
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
