const pool = require('../database/db');

const registrarEntrada = async (req, res) => {
    const { id_doador, data_doacao, observacoes, itens } = req.body;
    const id_usuario = req.userId;

    if (!id_doador || !itens || itens.length === 0) {
        return res.status(400).json({ message: 'Doador e lista de produtos são obrigatórios.' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [resultDoacao] = await connection.query(
            'INSERT INTO doacoes (id_doador, id_usuario, data_doacao, observacoes) VALUES (?, ?, ?, ?)',
            [id_doador, id_usuario, data_doacao || new Date(), observacoes]
        );
        const id_doacao = resultDoacao.insertId;

        for (const item of itens) {

            await connection.query(
                'INSERT INTO itens_doacao (id_doacao, id_produto, quantidade) VALUES (?, ?, ?)',
                [id_doacao, item.id_produto, item.quantidade]
            );


            await connection.query(
                'UPDATE produtos SET quantidade_estoque = quantidade_estoque + ? WHERE id_produto = ?',
                [item.quantidade, item.id_produto]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Doação registrada com sucesso!', id_doacao });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar doação.' });
    } finally {
        connection.release();
    }
};

const listarEntradas = async (req, res) => {
    try {
        const query = `
            SELECT 
                d.id_doacao, 
                d.data_doacao, 
                doa.nome AS nome_doador, 
                u.nome AS nome_responsavel,
                (SELECT COUNT(*) FROM itens_doacao WHERE id_doacao = d.id_doacao) AS total_itens
            FROM doacoes d
            JOIN doadores doa ON d.id_doador = doa.id_doador
            LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
            ORDER BY d.data_doacao DESC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar doações.' });
    }
};

const getDetalhesEntrada = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT i.quantidade, p.nome_produto
            FROM itens_doacao i
            JOIN produtos p ON i.id_produto = p.id_produto
            WHERE i.id_doacao = ?
        `;
        const [rows] = await pool.query(query, [id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar detalhes da doação.' });
    }
};

module.exports = { registrarEntrada, listarEntradas, getDetalhesEntrada };