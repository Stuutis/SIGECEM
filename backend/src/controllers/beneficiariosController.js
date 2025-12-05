const pool = require('../database/db');

const getAllBeneficiarios = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM beneficiarios ORDER BY id DESC");
        res.json(rows);
    } catch (error) {
        console.error("Erro ao listar beneficiários:", error);
        res.status(500).json({ error: "Erro ao buscar beneficiários" });
    }
};

const getBeneficiarioById = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM beneficiarios WHERE id = ?", [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Beneficiário não encontrado" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Erro ao buscar beneficiário:", error);
        res.status(500).json({ error: "Erro ao buscar beneficiário" });
    }
};

const createBeneficiario = async (req, res) => {
    const { nome, cpf, status } = req.body;
    if (!nome) {
        return res.status(400).json({ error: "Nome é obrigatório" });
    }
    try {
        const sql = "INSERT INTO beneficiarios (nome, cpf, status) VALUES (?, ?, ?)";
        const [result] = await pool.query(sql, [nome, cpf || null, status || "Ativa"]);
        res.status(201).json({ id: result.insertId, nome, cpf, status: status || "Ativa" });
    } catch (error) {
        console.error("Erro ao criar beneficiário:", error);
        res.status(500).json({ error: "Erro ao criar beneficiário" });
    }
};

const updateBeneficiario = async (req, res) => {
    const { nome, cpf, status } = req.body;
    try {
        const sql = "UPDATE beneficiarios SET nome = ?, cpf = ?, status = ? WHERE id = ?";
        const [result] = await pool.query(sql, [nome, cpf, status, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Beneficiário não encontrado" });
        }
        res.json({ id: req.params.id, nome, cpf, status });
    } catch (error) {
        console.error("Erro ao atualizar beneficiário:", error);
        res.status(500).json({ error: "Erro ao atualizar beneficiário" });
    }
};

const deleteBeneficiario = async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM beneficiarios WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Beneficiário não encontrado" });
        }
        res.json({ message: "Beneficiário removido com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir beneficiário:", error);
        res.status(500).json({ error: "Erro ao excluir beneficiário" });
    }
};

module.exports = {
    getAllBeneficiarios,
    getBeneficiarioById,
    createBeneficiario,
    updateBeneficiario,
    deleteBeneficiario
};