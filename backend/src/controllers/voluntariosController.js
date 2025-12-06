const pool = require('../database/db');
const bcrypt = require('bcryptjs');

// Listar todos os voluntários (apenas para Admin ver)
const getAllVoluntarios = async (req, res) => {
    try {

        const query = `
            SELECT id_usuario, nome, email, matricula, setor, data_ingresso, tipo 
            FROM usuarios 
            ORDER BY nome ASC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar voluntários.' });
    }
};

const createVoluntario = async (req, res) => {
    const { nome, email, senha, matricula, setor, data_ingresso, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    try {
        const [existing] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const query = `
            INSERT INTO usuarios (nome, email, senha, matricula, setor, data_ingresso, tipo) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(query, [
            nome, email, hashedPassword, matricula, setor, data_ingresso || new Date(), tipo
        ]);

        res.status(201).json({ message: 'Voluntário cadastrado com sucesso!', id: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar voluntário.' });
    }
};

// Atualizar Voluntário
const updateVoluntario = async (req, res) => {
    const { id } = req.params;
    const { nome, email, matricula, setor, tipo } = req.body;

    try {
        const query = `
            UPDATE usuarios 
            SET nome = ?, email = ?, matricula = ?, setor = ?, tipo = ? 
            WHERE id_usuario = ?
        `;
        await pool.query(query, [nome, email, matricula, setor, tipo, id]);

        res.json({ message: 'Dados do voluntário atualizados.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar voluntário.' });
    }
};

// Inativar/Remover Voluntário
const deleteVoluntario = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE usuarios SET data_saida = NOW() WHERE id_usuario = ?', [id]);
        res.json({ message: 'Voluntário inativado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao inativar voluntário.' });
    }
};

module.exports = { getAllVoluntarios, createVoluntario, updateVoluntario, deleteVoluntario };