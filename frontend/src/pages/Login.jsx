import React, { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../App.css"; // garanta que esse CSS está sendo importado

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await api.login(email, senha);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.usuario));

      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Erro ao fazer login");
    }
  }

  return (
    <div className="login-container">
      <div className="modal-card login-card">
        <h2 className="login-title">Acesso ao SIGECEM</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Digite seu e-mail"
          />

          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            placeholder="Digite sua senha"
          />

          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </form>

        <div className="login-link">
          <Link to="/register">Não tem conta? Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
}
