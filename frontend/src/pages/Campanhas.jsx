// src/pages/Campanhas.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";

const ENTITY = "campanhas";

function Form({ initial = {}, onCancel, onSave }) {
  const [form, setForm] = useState(initial);

  useEffect(() => setForm(initial), [initial]);

  function change(e) {
    const { name, value } = e.target;
    // Lógica de change unificada
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="modal">
      <form className="modal-card" onSubmit={submit}>
        <h3>{initial.id ? "Editar campanha" : "Nova campanha"}</h3>

        <label>
          Nome
          {/* Inputs do HEAD (mais limpos) foram unificados com a formatação do incoming */}
          <input name="nome" value={form.nome || ""} onChange={change} required />
        </label>

        <label>
          Data
          <input type="date" name="data" value={form.data || ""} onChange={change} />
        </label>

        <label>
          Quantidade arrecadada
          <input name="quantidade" value={form.quantidade || ""} onChange={change} />
        </label>

        <label>
          Foto (URL)
          <input
            name="foto"
            placeholder="https://server.com/imagem.jpg"
            value={form.foto || ""}
            onChange={change}
          />
        </label>

        {form.foto && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={form.foto}
              alt="preview"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(payload) {
    try {
      // Lógica de update/create unificada
      const idToUse = payload.id || payload._id;

      if (idToUse) {
        await api.update(ENTITY, idToUse, payload);
      } else {
        await api.create(ENTITY, payload);
      }
      
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Confirmar exclusão?")) return;
    // Apenas a versão HEAD tinha a quebra de linha (cosmético). Manter o código limpo.
    try {
      await api.remove(ENTITY, id);
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h1>Campanhas</h1>

      <div className="content-container">
        <div className="top-actions">
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            Adicionar campanha
          </button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                {/* Mantida a coluna Foto (HEAD) */}
                <th>Foto</th> 
                <th>Campanha</th>
                <th>Data</th>
                <th>Quantidade</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  {/* Colspan ajustado para 5 colunas (incluindo Foto) */}
                  <td colSpan="5">Nenhuma campanha.</td>
                </tr>
              )}

              {items.map((it) => (
                <tr key={it.id || it._id || Math.random()}>
                  {/* Coluna Foto (HEAD) */}
                  <td>
                    {it.foto ? (
                      <img
                        src={it.foto}
                        alt="campanha"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      <span>–</span>
                    )}
                  </td>
                  {/* Fim da Coluna Foto */}
                  
                  <td>{it.nome}</td>
                  <td>{it.data}</td>
                  <td>{it.quantidade}</td>

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