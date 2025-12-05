const pool = require('../database/db');

const getAllProdutos = async (req, res) => {
    try {
        const query = `
            SELECT p.*, c.nome_categoria 
            FROM produtos p 
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
        `;
        const [rows] = await pool.query(query);


        const formatted = rows.map(item => ({
            id: item.id_produto,
            produto: item.nome_produto,       // Renomeia para o frontend
            quantidade: item.quantidade_estoque, // Renomeia para o frontend
            categoria: item.nome_categoria || 'Sem Categoria',
            id_categoria: item.id_categoria
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar produtos.' });
    }
};

const createProduto = async (req, res) => {
    const { produto, quantidade, id_categoria } = req.body;

    if (!produto) {
        return res.status(400).json({ message: 'Nome do produto é obrigatório.' });
    }

    try {
        const query = 'INSERT INTO produtos (nome_produto, quantidade_estoque, id_categoria) VALUES (?, ?, ?)';
        const [result] = await pool.query(query, [produto, quantidade || 0, id_categoria || null]);

        res.status(201).json({
            message: 'Produto cadastrado com sucesso!',
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar produto.' });
    }
};

const updateProduto = async (req, res) => {
    const { id } = req.params;
    const { produto, quantidade, id_categoria } = req.body;

    try {
        const query = `
            UPDATE produtos 
            SET nome_produto = ?, quantidade_estoque = ?, id_categoria = ? 
            WHERE id_produto = ?
        `;
        const [result] = await pool.query(query, [produto, quantidade, id_categoria, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        res.status(200).json({ message: 'Produto atualizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar produto.' });
    }
};

const deleteProduto = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM produtos WHERE id_produto = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        res.status(200).json({ message: 'Produto removido com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao remover produto.' });
    }
};

module.exports = { getAllProdutos, createProduto, updateProduto, deleteProduto };