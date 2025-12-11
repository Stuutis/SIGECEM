const pool = require('../database/db');
const bcrypt = require('bcryptjs');

// Listar todos os voluntários (apenas para Admin ver)
const getAllVoluntarios = async (req, res) => {
    try {
        const query = `
            SELECT id_usuario AS id, nome, email, matricula, setor, data_ingresso, tipo 
            FROM usuarios 
            WHERE data_saida IS NULL -- Listar apenas voluntários ATIVOS
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
    // Note: Na rota de cadastro público (Register.jsx), 'tipo' não será enviado,
    // mas na rota de admin (Voluntarios.jsx), 'tipo' é enviado no formulário.
    const { nome, email, senha, matricula, setor, data_ingresso } = req.body;
    let { tipo } = req.body; // Inicialmente pegamos 'tipo' do body

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, E-mail e Senha são obrigatórios.' });
    }

    try {
        const [existing] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }
        
        // --- 🎯 Lógica para criar o Primeiro Admin (Opção 2) ---
        
        // 1. Checa o total de usuários existentes
        const [totalUsers] = await pool.query('SELECT COUNT(*) AS count FROM usuarios');
        const isFirstUser = totalUsers[0].count === 0;

        // 2. Define o tipo: se for o primeiro usuário, o tipo é 'admin',
        if (isFirstUser) {
            tipo = 'admin';
        } else if (!tipo) {
            // Se não é o primeiro usuário e o 'tipo' não foi explicitamente enviado (Ex: Cadastro Público)
            tipo = 'voluntario';
        }
        
        // ----------------------------------------------------

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const query = `
            INSERT INTO usuarios (nome, email, senha, matricula, setor, data_ingresso, tipo) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(query, [
            nome, email, hashedPassword, matricula, setor, data_ingresso || new Date(), tipo
        ]);

        res.status(201).json({ message: `Usuário (${tipo}) cadastrado com sucesso!`, id: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar voluntário.' });
    }
};

// Atualizar Voluntário
const updateVoluntario = async (req, res) => {
    const { id } = req.params; // id aqui é o id_usuario
    const { nome, email, matricula, setor, tipo } = req.body;

    try {
        const query = `
            UPDATE usuarios 
            SET nome = ?, email = ?, matricula = ?, setor = ?, tipo = ? 
            WHERE id_usuario = ?
        `;
        const [result] = await pool.query(query, [nome, email, matricula, setor, tipo, id]);
        
        // 🚨 CORREÇÃO: Usar 204 No Content para UPDATE bem-sucedido sem dados de retorno.
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voluntário não encontrado.' });
        }
        res.sendStatus(204); 
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar voluntário.' });
    }
};

// Inativar/Remover Voluntário
// Inativar/Remover Voluntário
const deleteVoluntario = async (req, res) => {
    const { id } = req.params; // id aqui é o id_usuario
    // 🚨 LOG DE DEBUG: Verifique qual ID está sendo recebido
    console.log(`Tentativa de inativar ID: ${id} (Tipo: ${typeof id})`); 
    
    try {
        const [result] = await pool.query('UPDATE usuarios SET data_saida = NOW() WHERE id_usuario = ?', [id]);
        
        if (result.affectedRows === 0) {
            // Se affectedRows for 0, o ID não foi encontrado.
            return res.status(404).json({ message: 'Voluntário não encontrado.' });
        }
        res.sendStatus(204); 
        
    } catch (error) {
        console.error('Erro de SQL ao inativar:', error);
        res.status(500).json({ message: 'Erro ao inativar voluntário.' });
    }
};

module.exports = { getAllVoluntarios, createVoluntario, updateVoluntario, deleteVoluntario };