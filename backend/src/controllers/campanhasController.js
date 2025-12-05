const pool = require('../database/db')

const getAllCampanhas = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM campanhas ORDER BY data DESC");
        res.json(rows)
    } catch (error) {
        console.error(err)
        res.status(500).send("Erro ao buscar campanhas")
    }
};

const getCampanhaById = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM campanhas WHERE id = ?", [req.params.id])
        if (!rows.length) return res.status(404).send("Campanha não encontrada")
        res.json(rows[0])
    } catch (error) {
        res.status(500).send("Erro ao buscar campanha")
    }
}

const createCampanha = async (req, res) => {
    const { nome, data, quantidade, foto } = req.body
    try {
        const sql = `INSERT INTO campanhas (nome, data, quantidade, foto) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [nome, data, quantidade, foto]);
        res.status(201).json({ id: result.insertId, nome, data, quantidade, foto })
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao criar campanha")
    }
}

const updateCampanha = async (req, res) => {
    const { nome, data, quantidade, foto } = req.body
    try {
        const sql = `UPDATE campanhas SET nome = ?, data = ?, quantidade = ?, foto = ? WHERE id = ?`;
        await pool.query(sql, [nome, data, quantidade, foto, req.params.id]);
        res.sendStatus(204);
    } catch (error) {
        console.error(error)
        res.status(500).send("Erro ao atualizar campanha")
    }
}

const deleteCamapnha = async (req, res) => {
    try {
        await pool.query("DELETE FROM campanhas WHERE id = ?", [req.params.id]);
        res.sendStatus(204)
    } catch (error) {
        console.error(error)
        res.status(500).send("Erro ao deletar campanha")
    }
}

module.exports = {
    getAllCampanhas,
    getCampanhaById,
    createCampanha,
    updateCampanha,
    deleteCamapnha
}