import React, { useEffect, useState } from "react";
import { api } from "../api";

const ENTITY = "campanhas";

function Form({ initial = {}, onCancel, onSave }) {
  const [form, setForm] = useState(initial);

  useEffect(() => setForm(initial), [initial]);

  function change(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();

    // 🔹 Nome obrigatório
    if (!form.nome?.trim()) return alert("O nome da campanha é obrigatório.");

    // 🔹 Data obrigatória
    if (!form.data) return alert("Informe a data da campanha.");

    // 🔹 Data futura não permitida
    const hoje = new Date().setHours(0,0,0,0);
    const dataCampanha = new Date(form.data).setHours(0,0,0,0);
    if (dataCampanha > hoje) return alert("A data não pode ser futura.");

    // 🔹 Quantidade numérica válida
    if (form.quantidade !== undefined && form.quantidade < 0)
      return alert("A quantidade não pode ser negativa.");

    // 🔹 Validar URL se preenchida
    const urlRegex = /^(https?:\/\/)([\w.-]+)\.([a-z.]{2,6})(\/\S*)?$/i;
    if (form.foto && !urlRegex.test(form.foto))
      return alert("A URL da imagem é inválida. Use algo como: https://site.com/imagem.jpg");

    onSave(form);
  }

  return (
    <div className="modal">
      <form className="modal-card" onSubmit={submit}>
        <h3>{initial.id ? "Editar campanha" : "Nova campanha"}</h3>

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
          Data
          <input
            type="date"
            name="data"
            value={form.data ? form.data.split("T")[0] : ""}
            onChange={change}
            required
          />
        </label>

        <label>
          Quantidade arrecadada
          <input
            type="number"
            min="0"
            name="quantidade"
            value={form.quantidade || ""}
            onChange={change}
            placeholder="0"
          />
        </label>

        <label>
          Foto (URL)
          <input
            name="foto"
            placeholder="https://exemplo.com/imagem.jpg"
            value={form.foto || ""}
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
                  <td colSpan="5">Nenhuma campanha.</td>
                </tr>
              )}

              {items.map((it) => (
                <tr key={it.id}>
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

                  <td>{it.nome}</td>
                  <td>{it.data ? new Date(it.data).toLocaleDateString() : "-"}</td>
                  <td>{it.quantidade || 0}</td>

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
                      style={{ marginLeft: "10px", backgroundColor: "#c0392b" }}
                      onClick={() => handleDelete(it.id)}
                    >
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
