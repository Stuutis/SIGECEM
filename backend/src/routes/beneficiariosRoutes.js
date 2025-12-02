const express = require("express");
const router = express.Router();
const pool = require("../database/db");


router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM beneficiarios ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar beneficiários:", err);
    res.status(500).json({ error: "Erro ao buscar beneficiários" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM beneficiarios WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Beneficiário não encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar beneficiário:", err);
    res.status(500).json({ error: "Erro ao buscar beneficiário" });
  }
});


router.post("/", async (req, res) => {
  const { nome, cpf, status } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  try {
    const sql =
      "INSERT INTO beneficiarios (nome, cpf, status) VALUES (?, ?, ?)";

    const [result] = await pool.query(sql, [
      nome,
      cpf || null,
      status || "Ativa",
    ]);

    res.status(201).json({
      id: result.insertId,
      nome,
      cpf,
      status: status || "Ativa",
    });
  } catch (err) {
    console.error("Erro ao criar beneficiário:", err);
    res.status(500).json({ error: "Erro ao criar beneficiário" });
  }
});


router.put("/:id", async (req, res) => {
  const { nome, cpf, status } = req.body;

  try {
    const sql =
      "UPDATE beneficiarios SET nome = ?, cpf = ?, status = ? WHERE id = ?";

    const [result] = await pool.query(sql, [
      nome,
      cpf,
      status,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Beneficiário não encontrado" });
    }

    res.json({
      id: req.params.id,
      nome,
      cpf,
      status,
    });
  } catch (err) {
    console.error("Erro ao atualizar beneficiário:", err);
    res.status(500).json({ error: "Erro ao atualizar beneficiário" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM beneficiarios WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Beneficiário não encontrado" });
    }

    res.json({ message: "Beneficiário removido com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir beneficiário:", err);
    res.status(500).json({ error: "Erro ao excluir beneficiário" });
  }
});

module.exports = router;
