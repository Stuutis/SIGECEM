// src/pages/Familias.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";
const ENTITY = "familias";

export default function Familias() {
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
      if (payload.id_familia)
        await api.update(ENTITY, payload.id_familia, payload);
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
          <h3>{initial.id_familia ? "Editar família" : "Nova família"}</h3>

          <label>
            Responsável
            <input
              name="nome_responsavel"
              value={form.nome_responsavel || ""}
              onChange={change}
              required
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
            />
          </label>

          <label>
            Nº Integrantes
            <input
              type="number"
              name="n_integrantes"
              value={form.n_integrantes || ""}
              onChange={change}
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
                  <td colSpan="5">Nenhuma família.</td>
                </tr>
              )}

              {items.map((it) => (
                <tr key={it.id_familia}>
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

                    <button onClick={() => handleDelete(it.id_familia)}>
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
