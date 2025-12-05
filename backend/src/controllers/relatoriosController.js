const pool = require('../database/db');

const getResumoGeral = async (req, res) => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM doadores) AS total_doadores,
                (SELECT COUNT(*) FROM familias) AS total_familias,
                (SELECT COALESCE(SUM(quantidade_estoque), 0) FROM produtos) AS itens_estoque,
                (SELECT COUNT(*) FROM campanhas) AS campanhas_ativas
        `;
        const [rows] = await pool.query(query);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar resumo geral.' });
    }
};

const getRelatorioDoacoes = async (req, res) => {
    const { inicio, fim } = req.query;
    try {
        let query = `
            SELECT d.data_doacao, doa.nome AS doador, p.nome_produto, i.quantidade
            FROM itens_doacao i
            JOIN doacoes d ON i.id_doacao = d.id_doacao
            JOIN doadores doa ON d.id_doador = doa.id_doador
            JOIN produtos p ON i.id_produto = p.id_produto
        `;

        const params = [];
        if (inicio && fim) {
            query += ' WHERE d.data_doacao BETWEEN ? AND ?';
            params.push(inicio, fim);
        }

        query += ' ORDER BY d.data_doacao DESC';

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao gerar relatório de doações.' });
    }
};

const getRelatorioDistribuicoes = async (req, res) => {
    const { inicio, fim } = req.query;

    try {
        let query = `
            SELECT d.data_entrega, f.nome_responsavel AS familia, p.nome_produto, i.quantidade
            FROM itens_distribuicao i
            JOIN distribuicoes d ON i.id_distribuicao = d.id_distribuicao
            JOIN familias f ON d.id_familia = f.id_familia
            JOIN produtos p ON i.id_produto = p.id_produto
        `;

        const params = [];
        if (inicio && fim) {
            query += ' WHERE d.data_entrega BETWEEN ? AND ?';
            params.push(inicio, fim);
        }

        query += ' ORDER BY d.data_entrega DESC';

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao gerar relatório de distribuições.' });
    }
};

module.exports = { getResumoGeral, getRelatorioDoacoes, getRelatorioDistribuicoes };