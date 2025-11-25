// src/pages/Beneficiarios.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";

const ENTITY = "beneficiarios";

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
        <h3>{initial.id ? "Editar beneficiário" : "Novo beneficiário"}</h3>
        <label>
          Nome
          <input
            name="nome"
            value={form.nome || ""}
            onChange={change}
            required
          />
        </label>
        <label>
          CPF
          <input name="cpf" value={form.cpf || ""} onChange={change} />
        </label>
        <label>
          Status
          <select
            name="status"
            value={form.status || "Ativa"}
            onChange={change}
          >
            <option>Ativa</option>
            <option>Inativa</option>
          </select>
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

export default function Beneficiarios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // item being edited or null
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await api.list(ENTITY);
      setItems(data || []);
    } catch (err) {
      setError(err.message || "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(payload) {
    try {
      if (payload.id) {
        await api.update(ENTITY, payload.id, payload);
      } else {
        await api.create(ENTITY, payload);
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Confirmar exclusão?")) return;
    try {
      await api.remove(ENTITY, id);
      await load();
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
    }
  }

  return (
    <div>
      <h1>Beneficiários</h1>

      <div className="content-container">
        <div className="top-actions">
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            Adicionar beneficiário
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan="4">Nenhum beneficiário encontrado.</td>
                </tr>
              )}
              {items.map((it) => (
                <tr key={it.id || it._id || Math.random()}>
                  <td>{it.nome}</td>
                  <td>{it.cpf}</td>
                  <td>{it.status}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditing(it);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDelete(it.id || it._id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
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
