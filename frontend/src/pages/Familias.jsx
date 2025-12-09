import React, { useEffect, useState } from "react";
import { api } from "../api";

// O endpoint no index.js é '/api/familias' 
const ENTITY = "familias";

export default function Familias() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // para bloquear botão enquanto deleta

  async function load() {
    setLoading(true);
    try {
      const data = await api.list(ENTITY);
      setItems(data || []);
    } catch (err) {
      console.error("Erro ao carregar famílias:", err);
      alert(err?.message || "Erro ao carregar famílias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(payload) {
    // Validações básicas (mantidas)
    if (!payload.nome_responsavel || payload.nome_responsavel.length < 3) {
      return alert("O nome do responsável deve conter no mínimo 3 caracteres.");
    }

    if (payload.contato && payload.contato.replace(/\D/g, "").length < 10) {
      return alert("Informe um contato válido (mínimo 10 dígitos).");
    }

    if (payload.n_integrantes && Number(payload.n_integrantes) < 1) {
      return alert("Número de integrantes deve ser maior que 0.");
    }

    try {
      if (payload.id_familia) {
        await api.update(ENTITY, payload.id_familia, payload);
      } else if (payload.id) {
        // em alguns backends a chave pode ser 'id'
        await api.update(ENTITY, payload.id, payload);
      } else {
        await api.create(ENTITY, payload);
      }

      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      console.error("Erro ao salvar família:", err);
      // tenta mostrar mensagem do backend quando disponível
      const msg = err?.response?.data?.message || err?.message || "Erro ao salvar.";
      alert("Erro ao salvar: " + msg);
    }
  }

  async function handleDelete(idParam) {
    // tenta normalizar id (pode receber id_familia ou um objeto)
    let id = idParam;
    if (!id && typeof idParam === "object") {
      id = idParam.id_familia ?? idParam.id;
    }

    // Se usuário clicou no botão, muitas vezes passamos o item inteiro — faça robusto:
    if (!id && typeof idParam === "number") id = idParam;

    // Procura id na tabela caso ainda null (fallback)
    if (!id && editing) id = editing.id_familia ?? editing.id;

    if (!id) {
      console.error("handleDelete: id inválido recebido:", idParam);
      return alert("Erro interno: ID da família inválido. Verifique o console.");
    }

    if (!confirm("Confirmar exclusão?")) return;

    try {
      setDeletingId(id);
      console.log("Enviando requisição DELETE para", ENTITY, id);
      await api.remove(ENTITY, id);
      console.log("Exclusão OK para id:", id);
      await load();
    } catch (err) {
      console.error("Erro ao excluir família:", err);
      const msg = err?.response?.data?.message || err?.message || "Erro ao excluir.";
      alert("Erro ao excluir: " + msg);
    } finally {
      setDeletingId(null);
    }
  }

  function Form({ initial = {}, onCancel, onSave }) {
    const [form, setForm] = useState(initial);

    useEffect(() => setForm(initial), [initial]);

    function change(e) {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    function submit(e) {
      e.preventDefault();
      onSave(form);
    }

    return (
      <div className="modal">
        <form className="modal-card" onSubmit={submit}>
          <h3>{initial.id_familia || initial.id ? "Editar família" : "Nova família"}</h3>

          <label>
            Responsável *
            <input
              name="nome_responsavel"
              value={form.nome_responsavel || ""}
              onChange={change}
              required
              minLength={3}
            />
          </label>

          <label>
            Endereço
            <input
              name="endereco"
              value={form.endereco || ""}
              onChange={change}
            />
          </label>

          <label>
            Contato
            <input
              name="contato"
              value={form.contato || ""}
              onChange={change}
              placeholder="Telefone / WhatsApp"
            />
          </label>

          <label>
            Nº Integrantes
            <input
              type="number"
              name="n_integrantes"
              value={form.n_integrantes || ""}
              onChange={change}
              min={1}
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

  return (
    <div>
      <h1>Famílias</h1>

      <div className="content-container">
        <div className="top-actions">
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            Adicionar família
          </button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Responsável</th>
                <th>Endereço</th>
                <th>Contato</th>
                <th>Integrantes</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan="5">Nenhuma família encontrada.</td>
                </tr>
              )}

              {items.map((it) => {
                const key = it.id_familia ?? it.id ?? Math.random();
                const idToUse = it.id_familia ?? it.id;
                return (
                  <tr key={key}>
                    <td>{it.nome_responsavel}</td>
                    <td>{it.endereco}</td>
                    <td>{it.contato}</td>
                    <td>{it.n_integrantes}</td>

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
                        style={{ marginLeft: 10, backgroundColor: "#c0392b" }}
                        onClick={() => handleDelete(idToUse)}
                        disabled={deletingId === idToUse}
                        title={deletingId === idToUse ? "Excluindo..." : "Excluir"}
                      >
                        {deletingId === idToUse ? "Excluindo..." : "Excluir"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <Form
          initial={editing || {}}
          onCancel={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
