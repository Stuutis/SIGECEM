import React, { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.register(form.nome, form.email, form.senha);
      alert("Cadastro realizado com sucesso! Faça login.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Novo Usuário</h2>

        {error && (
          <p className="error" style={{ textAlign: "center", padding: "10px", borderRadius: "8px", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input 
              name="nome" 
              onChange={handleChange} 
              required 
              placeholder="Digite seu nome completo"
            />
          </label>

          <label>
            E-mail
            <input 
              name="email" 
              type="email" 
              onChange={handleChange} 
              required 
              placeholder="seu@email.com"
            />
          </label>

          <label>
            Senha
            <input
              name="senha"
              type="password"
              onChange={handleChange}
              required
              placeholder="Crie uma senha segura"
            />
          </label>

          <button type="submit" className="btn-primary">
            Cadastrar
          </button>
        </form>

        <div className="login-link" style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
          <Link to="/login">Já tem uma conta? Faça login</Link>
        </div>
      </div>
    </div>
  );
}
