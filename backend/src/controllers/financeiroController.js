const pool = require('../database/db');

const registrarMovimentacao = async (req, res) => {
    const { tipo, descricao, valor, id_doador } = req.body;
    const id_usuario = req.userId;

    if (!tipo || !descricao || !valor) {
        return res.status(400).json({ message: 'Tipo, descrição e valor são obrigatórios.' });
    }

    if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
        return res.status(400).json({ message: 'Tipo inválido. Use ENTRADA ou SAIDA.' });
    }

    try {
        const query = `
            INSERT INTO financeiro (tipo, descricao, valor, id_usuario, id_doador) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [tipo, descricao, valor, id_usuario, id_doador || null]);

        res.status(201).json({ message: 'Movimentação registrada com sucesso!', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar movimentação.' });
    }
};

const listarMovimentacoes = async (req, res) => {
    try {
        const query = `
            SELECT f.*, u.nome as responsavel, d.nome as doador
            FROM financeiro f
            LEFT JOIN usuarios u ON f.id_usuario = u.id_usuario
            LEFT JOIN doadores d ON f.id_doador = d.id_doador
            ORDER BY f.data_movimentacao DESC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar financeiro.' });
    }
};

const getSaldo = async (req, res) => {
    try {
        const query = `
            SELECT 
                SUM(CASE WHEN tipo = 'ENTRADA' THEN valor ELSE 0 END) as total_entradas,
                SUM(CASE WHEN tipo = 'SAIDA' THEN valor ELSE 0 END) as total_saidas,
                (SUM(CASE WHEN tipo = 'ENTRADA' THEN valor ELSE 0 END) - 
                 SUM(CASE WHEN tipo = 'SAIDA' THEN valor ELSE 0 END)) as saldo_final
            FROM financeiro
        `;
        const [rows] = await pool.query(query);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao calcular saldo.' });
    }
};

module.exports = { registrarMovimentacao, listarMovimentacoes, getSaldo };