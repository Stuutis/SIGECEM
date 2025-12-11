import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";

const ENTITY = "doadores";

// Função para validar CPF
const validaCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += cpf[i] * (10 - i);
  let d1 = (soma * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== Number(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += cpf[i] * (11 - i);
  let d2 = (soma * 10) % 11;
  if (d2 === 10) d2 = 0;

  return d2 === Number(cpf[10]);
};

// Função para validar CNPJ
const validaCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/\D/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);

  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros[tamanho - i] * pos--;
    if (pos < 2) pos = 9;
  }

  let d1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (d1 !== Number(digitos[0])) return false;

  soma = 0;
  tamanho += 1;
  numeros = cnpj.substring(0, tamanho);
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros[tamanho - i] * pos--;
    if (pos < 2) pos = 9;
  }

  let d2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return d2 === Number(digitos[1]);
};

// Máscaras
const maskDocumento = (v) => {
  v = v.replace(/\D/g, "");

  if (v.length <= 11)
    return v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  return v
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

const maskTelefone = (v) =>
  v
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/-(\d{4})\d+?$/, "-$1");

function Form({ initial = {}, onCancel, onSave }) {
  const isEditing = !!initial.id_doador;
  const [f, setF] = useState(isEditing ? initial : { ...initial });

  useEffect(() => setF(isEditing ? initial : { ...initial }), [initial]);

  function change(e) {
    let { name, value } = e.target;

    if (name === "documento") value = maskDocumento(value);
    if (name === "telefone") value = maskTelefone(value);

    setF((p) => ({ ...p, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();

    if (!f.nome?.trim()) return alert("Nome é obrigatório.");

    const doc = f.documento?.replace(/\D/g, "");
    if (!doc) return alert("Documento é obrigatório.");

    if (f.tipo_pessoa === "F" && !validaCPF(doc)) return alert("CPF inválido!");
    if (f.tipo_pessoa === "J" && !validaCNPJ(doc)) return alert("CNPJ inválido!");

    onSave(f);
  }

  return (
    <div className="modal">
      <form className="modal-card" onSubmit={submit}>
        <h3>{isEditing ? "Editar doador" : "Novo doador"}</h3>

        <label>
          Nome
          <input name="nome" value={f.nome || ""} onChange={change} required />
        </label>

        <label>
          Tipo Pessoa
          <select name="tipo_pessoa" value={f.tipo_pessoa || "F"} onChange={change}>
            <option value="F">Física</option>
            <option value="J">Jurídica</option>
          </select>
        </label>

        <label>
          Documento
          <input name="documento" value={f.documento || ""} onChange={change} required />
        </label>

        <label>
          Telefone
          <input name="telefone" value={f.telefone || ""} onChange={change} />
        </label>

        <label>
          Email
          <input name="email" type="email" value={f.email || ""} onChange={change} />
        </label>

        <div className="modal-actions">
          <button type="button" onClick={onCancel}>Cancelar</button>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}

export default function Doadores() {
  const { isAdmin } = useAuth();
  const userIsAdmin = isAdmin();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.list(ENTITY);
      setItems(data || []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(payload) {
    try {
      if (payload.id_doador)
        await api.update(ENTITY, payload.id_doador, payload);
      else
        await api.create(ENTITY, payload);

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
      alert("Erro ao excluir: " + (err.message || "Erro de comunicação com o servidor."));
    }
  }

// ... parte superior do componente Doadores ...

  return (
    <div>
      <h1>Doadores</h1>

      <div className="content-container">
        {/* Botão de ação (sempre visível dentro do content-container) */}
        <button onClick={() => { setEditing(null); setShowForm(true); }}>
          Adicionar doador
        </button>

        {/* Bloco de carregamento OU Tabela (renderização condicional) */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          /* O resto do conteúdo é a tabela */
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Documento</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Nenhum doador cadastrado.</p>
                  </td>
                </tr>
              )}

              {items.map((it) => (
                <tr key={it.id_doador}>
                  <td>{it.nome}</td>
                  <td>{it.documento}</td>
                  <td>{it.telefone}</td>
                  <td>{it.email}</td>

                  {/* AÇÕES (Editar/Excluir) */}
                  <td>
                    <button onClick={() => { setEditing(it); setShowForm(true); }}>
                      Editar
                    </button>

                    {userIsAdmin && (
                      <button
                        style={{ marginLeft: 10, backgroundColor: "#c0392b", color: "white" }}
                        onClick={() => handleDelete(it.id_doador)}
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div> {/* A tag de fechamento da div content-container deve estar aqui. */}

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
