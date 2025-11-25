// src/pages/Doadores.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";
const ENTITY = "doadores";

function Form({ initial = {}, onCancel, onSave }) {
  const [f, setF] = useState(initial);
  useEffect(() => setF(initial), [initial]);
  function change(e) {
    const { name, value } = e.target;
    setF((prev) => ({ ...prev, [name]: value }));
  }
  function submit(e) {
    e.preventDefault();
    onSave(f);
  }

  return (
    <div className="modal">
      <form className="modal-card" onSubmit={submit}>
        <h3>{initial.id ? "Editar doador" : "Novo doador"}</h3>
        <label>
          Nome
          <input name="nome" value={f.nome || ""} onChange={change} required />
        </label>
        <label>
          Contato
          <input name="contato" value={f.contato || ""} onChange={change} />
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

export default function Doadores() {
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
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function handleSave(payload) {
    try {
      if (payload.id) await api.update(ENTITY, payload.id, payload);
      else await api.create(ENTITY, payload);
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Confirmar exclusão?")) return;
    try {
      await api.remove(ENTITY, id);
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h1>Doadores</h1>
      <div className="content-container">
        <div className="top-actions">
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            Adicionar doador
          </button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan="3">Nenhum doador.</td>
                </tr>
              )}
              {items.map((it) => (
                <tr key={it.id || it._id || Math.random()}>
                  <td>{it.nome}</td>
                  <td>{it.contato}</td>
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
          onCancel={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
