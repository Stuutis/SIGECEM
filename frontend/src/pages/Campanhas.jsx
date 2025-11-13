// src/pages/Campanhas.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";

const ENTITY = "campanhas";

function Form({ initial = {}, onCancel, onSave }) {
  const [form, setForm] = useState(initial);
  useEffect(() => setForm(initial), [initial]);
  function change(e) { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); }
  function submit(e) { e.preventDefault(); onSave(form); }

  return (
    <div className="modal">
      <form className="modal-card" onSubmit={submit}>
        <h3>{initial.id ? "Editar campanha" : "Nova campanha"}</h3>
        <label>Nome
          <input name="nome" value={form.nome || ""} onChange={change} required />
        </label>
        <label>Data
          <input type="date" name="data" value={form.data || ""} onChange={change} />
        </label>
        <label>Quantidade arrecadada
          <input name="quantidade" value={form.quantidade || ""} onChange={change} />
        </label>

        <div className="modal-actions">
          <button type="button" onClick={onCancel}>Cancelar</button>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}

export default function Campanhas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await api.list(ENTITY);
      setItems(data || []);
    } catch (err) {
      alert(err.message);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(payload) {
    try {
      if (payload.id) await api.update(ENTITY, payload.id, payload);
      else await api.create(ENTITY, payload);
      setShowForm(false); setEditing(null); await load();
    } catch (err) { alert(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm("Confirmar exclusão?")) return;
    try { await api.remove(ENTITY, id); await load(); } catch (err) { alert(err.message); }
  }

  return (
    <div>
      <h1>Campanhas</h1>
      <div className="content-container">
        <div className="top-actions">
          <button onClick={() => { setEditing(null); setShowForm(true); }}>Adicionar campanha</button>
        </div>

        {loading ? <p>Carregando...</p> : (
          <table className="tabela">
            <thead>
              <tr><th>Campanha</th><th>Data</th><th>Quantidade</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan="4">Nenhuma campanha.</td></tr>}
              {items.map(it => (
                <tr key={it.id || it._id || Math.random()}>
                  <td>{it.nome}</td>
                  <td>{it.data}</td>
                  <td>{it.quantidade}</td>
                  <td>
                    <button onClick={() => { setEditing(it); setShowForm(true); }}>Editar</button>
                    <button onClick={() => handleDelete(it.id || it._id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && <Form initial={editing || {}} onCancel={() => setShowForm(false)} onSave={handleSave} />}
    </div>
  );
}
