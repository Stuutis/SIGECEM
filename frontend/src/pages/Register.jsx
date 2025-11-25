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
    <div style={styles.container}>
      <div className="modal-card" style={styles.card}>
        <h2 style={{ textAlign: "center", color: "var(--primary)" }}>
          Novo Usuário
        </h2>

        {error && (
          <p className="error" style={{ textAlign: "center" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Nome <input name="nome" onChange={handleChange} required />
          </label>
          <label>
            E-mail{" "}
            <input name="email" type="email" onChange={handleChange} required />
          </label>
          <label>
            Senha{" "}
            <input
              name="senha"
              type="password"
              onChange={handleChange}
              required
            />
          </label>

          <div
            className="modal-actions"
            style={{ marginTop: "20px", flexDirection: "column" }}
          >
            <button type="submit" style={{ width: "100%", margin: 0 }}>
              Cadastrar
            </button>
          </div>
        </form>

        <div
          style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}
        >
          <Link to="/login">Voltar para Login</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f7fb",
  },
  card: { maxWidth: "400px", width: "100%" },
};
