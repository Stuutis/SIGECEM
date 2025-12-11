import React, { useEffect, useState, useCallback } from "react";

// MOCK sem backend
const mockDB = [
  { id: 1, produto: "Arroz", quantidade: 10, categoria: "Alimentos" },
  { id: 2, produto: "Sabão", quantidade: 5, categoria: "Limpeza" }
];

const api = {
  list: async () => mockDB,
  create: async (entity, item) => {
    item.id = mockDB.length + 1;
    mockDB.push(item);
  },
  update: async (entity, id, item) => {
    const idx = mockDB.findIndex((i) => i.id === id);
    if (idx !== -1) mockDB[idx] = { ...mockDB[idx], ...item };
  },
  remove: async (entity, id) => {
    const idx = mockDB.findIndex((i) => i.id === id);
    if (idx !== -1) mockDB.splice(idx, 1);
  }
};

// ================= FORM ==================
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
    if (!f.produto) return alert("Informe o nome do produto!");

    onSave(f);
  }

  return (
    <div className="modal">
      <form className="modal-card" onSubmit={submit}>
        <h3>{initial.id ? "Editar Produto" : "Novo Produto"}</h3>

        <label>Produto
          <input
            name="produto"
            value={f.produto}
            onChange={change}
            required
          />
        </label>

        <label>Quantidade
          <input
            name="quantidade"
            type="number"
            min="0"
            value={f.quantidade}
            onChange={change}
          />
        </label>

        <label>Categoria
          <input
            name="categoria"
            value={f.categoria}
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
  const userIsAdmin = true;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);


  const load = useCallback(async () => {
    setLoading(true);
    const data = await api.list("estoque");
    setItems([...data]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);



  async function handleSave(payload) {
    if (payload.id) await api.update("estoque", payload.id, payload);
    else await api.create("estoque", payload);

    setShowForm(false);
    setEditing(null);
    load();
  }


  async function handleDelete(id) {
    if (!confirm("Confirmar exclusão?")) return;
    await api.remove("estoque", id);
    load();
  }


  return (
    <div>
      <h1>Estoque / Produtos</h1>

      <div className="content-container">

        {userIsAdmin && (
          <button onClick={() => { setEditing(null); setShowForm(true); }}>
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
                      style={{ marginLeft: 10, backgroundColor: "#c0392b", color: "white" }}
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
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
