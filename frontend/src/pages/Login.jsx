import React, { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await api.login(email, senha);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.usuario));
      navigate("/");
    } catch (err) {
      setError(err.message || "Erro ao fazer login");
    }
  }

  return (
    <div style={styles.container}>
      <div className="modal-card" style={styles.card}>
        <h2 style={{ textAlign: "center", color: "var(--primary)" }}>
          Login SIGECEM
        </h2>

        {error && (
          <p className="error" style={{ textAlign: "center" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          <div
            className="modal-actions"
            style={{ marginTop: "20px", flexDirection: "column" }}
          >
            <button type="submit" style={{ width: "100%", margin: 0 }}>
              Entrar
            </button>
          </div>
        </form>

        <div
          style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}
        >
          <Link to="/register">Não tem conta? Cadastre-se</Link>
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
  card: {
    maxWidth: "400px",
    width: "100%",
  },
};
