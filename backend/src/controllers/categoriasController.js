const pool = require('../database/db');

const getAllCategorias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categorias');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar categorias.' });
    }
};

const createCategoria = async (req, res) => {
    const { nome_categoria } = req.body;

    if (!nome_categoria) {
        return res.status(400).json({ message: 'Nome da categoria é obrigatório.' });
    }

    try {
        const [result] = await pool.query('INSERT INTO categorias (nome_categoria) VALUES (?)', [nome_categoria]);
        res.status(201).json({
            message: 'Categoria criada com sucesso!',
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar categoria.' });
    }
};

module.exports = { getAllCategorias, createCategoria };