import React, { useEffect, useState, useCallback } from "react"; 
import { api } from "../api";
import { useAuth } from "../hooks/useAuth"; 

const ENTITY = "voluntarios";

function Form({ initial = {}, onCancel, onSave }) {
  // Flag para saber se estamos editando (initial.id_usuario existe) ou criando
  const isEditing = !!initial.id_usuario; 
  
  const [form, setForm] = useState(
    isEditing ? initial : { ...initial, tipo: "voluntario" }
  );

  useEffect(() => {
    setForm(isEditing ? initial : { ...initial, tipo: "voluntario" });
  }, [initial]);

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
        <h3>{isEditing ? "Editar Voluntário" : "Novo Voluntário"}</h3>

        {/* LINHA 1: Nome e E-mail - Layout de 2 colunas */}
        <div className="form-row">
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
                E-mail
                <input
                    name="email"
                    type="email"
                    value={form.email || ""}
                    onChange={change}
                    required
                />
            </label>
        </div>
        
        {/* LINHA 2: Senha (se for criação) - Layout de 1 coluna */}
        {!isEditing && (
          <label>
            Senha
            <input
              name="senha"
              type="password"
              value={form.senha || ""}
              onChange={change}
              required 
            />
          </label>
        )}

        {/* LINHA 3: Matrícula e Setor - Layout de 2 colunas */}
        <div className="form-row">
            <label>
                Matrícula
                <input
                    name="matricula"
                    value={form.matricula || ""}
                    onChange={change}
                />
            </label>

            <label>
                Setor
                <input
                    name="setor"
                    value={form.setor || ""}
                    onChange={change}
                />
            </label>
        </div>

        {/* LINHA 4: Tipo - Layout de 1 coluna */}
        <label>
          Tipo
          <select
            name="tipo"
            value={form.tipo || "voluntario"}
            onChange={change}
            required
          >
            <option value="voluntario">Voluntário</option>
            <option value="admin">Admin</option>
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

export default function Voluntarios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  
  // Usa o hook de autenticação
  const { isAdmin } = useAuth(); 

  const userIsAdmin = isAdmin(); 

 
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.list(ENTITY);
      
      
      setItems(data || []);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Acesso negado. Apenas administradores podem visualizar esta lista.");
      } else {
        setError(err.message || "Erro ao carregar lista de voluntários.");
      }
      setItems([]); 
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    // 🚨 CORREÇÃO AQUI: Verifica o VALOR userIsAdmin (booleano) e chama a função load (estável)
    if (userIsAdmin) { 
      load();
    } else {
      setError("Você não tem permissão de administrador para acessar a gestão de voluntários.");
    }
  }, [userIsAdmin, load]); // 🚨 Dependência correta. userIsAdmin só muda no login/logout.

  async function handleSave(payload) {
    try {
      if (payload.id_usuario) {
        await api.update(ENTITY, payload.id_usuario, payload);
      } else {
        // Lembrete: A criação precisa de 'senha'
        await api.create(ENTITY, payload); 
      }
      
      setShowForm(false);
      setEditing(null);
      await load(); // Recarrega a lista após a operação
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Confirmar inativação do voluntário?")) return;
    
    // 🚨 LOG para verificar qual ID está sendo enviado (mantido da correção anterior)
    console.log("Frontend enviando ID para delete:", id);
    if (!id) {
        alert("Erro interno: ID do voluntário é inválido ou está faltando.");
        console.error("ID faltando na lista de itens:", id);
        return;
    }

    try {
      await api.remove(ENTITY, id);
      console.log(`SUCESSO: Voluntário ID ${id} inativado. Recarregando lista.`);
      await load(); // Recarrega a lista após a inativação
    } catch (err) {
      // Usamos o console.error para ver o objeto de erro completo
      console.error(`FALHA na Inativação do ID ${id}:`, err);
      alert("Erro ao inativar: " + (err.message || "Erro de comunicação com o servidor."));
    }
  }

  return (
    <div>
      <h1>Voluntários</h1>

      <div className="content-container">
        
        {/* Mostra o botão de Adicionar APENAS se for Admin */}
        {userIsAdmin && ( // Usando a variável estável
          <div className="top-actions">
            <button
              onClick={() => {
                setEditing(null); 
                setShowForm(true);
              }}
            >
              Adicionar Voluntário
            </button>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Matrícula</th>
                <th>Setor</th>
                <th>Tipo</th>
                {userIsAdmin && <th>Ações</th>} {/* Coluna Ações só para Admin */}
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && !error && (
                <tr>
                  <td colSpan={userIsAdmin ? "6" : "5"}>Nenhum voluntário encontrado.</td>
                </tr>
              )}

              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.nome}</td>
                  <td>{it.email}</td>
                  <td>{it.matricula || "N/A"}</td>
                  <td>{it.setor || "N/A"}</td>
                  <td>{it.tipo}</td>
                  
                  {/* Botões de Ações só para Admin */}
                  {userIsAdmin && (
                    <td>
                      <button
                        onClick={() => {
                          setEditing(it); 
                          setShowForm(true);
                        }}
                      >
                        Editar
                      </button>
                      <button onClick={() => handleDelete(it.id)}>
                        Inativar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Exibe o Formulario APENAS se showForm for true E o usuário for Admin */}
      {showForm && userIsAdmin && (
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
