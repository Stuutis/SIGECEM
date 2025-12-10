import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";

const ENTITY = "estoque";

// ================= FORM COMPONENTE ==================
function Form({ initial = {}, onCancel, onSave }) {
  const [f, setF] = useState(initial);

  useEffect(() => setF(initial), [initial]);

  function change(e) {
    const { name, value } = e.target;
    setF((p) => ({ ...p, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!f.produto) return alert("Informe o nome do produto!");
    if (!f.quantidade) f.quantidade = 0;
    onSave(f);
  }

  return (
    <div className="modal">
      <form className="modal-card" onSubmit={submit}>
        <h3>{initial.id ? "Editar Produto" : "Novo Produto"}</h3>

        <label>Produto
          <input name="produto" value={f.produto || ""} onChange={change} required />
        </label>

        <label>Quantidade
          <input name="quantidade" type="number" min="0"
            value={f.quantidade || ""} onChange={change} />
        </label>

        <label>Categoria
          <input
            name="categoria"
            value={f.categoria || ""}
            onChange={change}
            placeholder="Ex: Alimentos, Limpeza..."
          />
        </label>

        <div className="modal-actions">
          <button type="button" onClick={onCancel}>Cancelar</button>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}

// ================= ESTOQUE ==================
export default function Estoque() {
  const { isAdmin } = useAuth();
  const userIsAdmin = isAdmin();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // ================= LOAD ==================
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.list(ENTITY);
      setItems(data || []);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ================= SAVE ==================
  async function handleSave(payload) {
    try {
      if (payload.id)
        await api.update(ENTITY, payload.id, payload);
      else
        await api.create(ENTITY, payload);

      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) {
      alert("Erro ao salvar produto: " + err.message);
    }
  }

  // ================= DELETE ==================
  async function handleDelete(id) {
    if (!confirm("Confirmar exclusão?")) return;

    try {
      await api.remove(ENTITY, id);
      load();
    } catch (err) {
      alert("Erro ao excluir: " + (err.message || "Erro de comunicação com o servidor."));
    }
  }

  // ================= UI ==================
  return (
    <div>
      <h1>Estoque / Produtos</h1>

      <div className="content-container">
        {/* Botão Adicionar Produto: APENAS Admin */}
        {userIsAdmin && (
          <button onClick={() => { setEditing(null); setShowForm(true); }}>
            + Adicionar Produto
          </button>
        )}

        {loading ? <p>Carregando...</p> : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Categoria</th>
                {userIsAdmin && <th>Ações</th>}
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={userIsAdmin ? 4 : 3}>Nenhum produto cadastrado.</td>
                </tr>
              )}

              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.produto}</td>
                  <td>{it.quantidade}</td>
                  <td>{it.categoria}</td>

                  {userIsAdmin && (
                    <td>
                      <button onClick={() => { setEditing(it); setShowForm(true); }}>
                        Editar
                      </button>
                      <button
                        style={{ marginLeft: 10, backgroundColor: "#c0392b", color: "white" }}
                        onClick={() => handleDelete(it.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Formulário visível apenas para Admin */}
      {showForm && userIsAdmin && (
        <Form
          initial={editing || {}}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
