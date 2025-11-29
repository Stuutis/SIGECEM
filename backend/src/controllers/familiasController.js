const pool = require('../database/db');

// Listar todas familias
const getAllFamilias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM familias')
        res.status(200).json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao buscar familias' })
    }
};

// Listar somente uma familia
const getFamiliaById = async (req, res) => {
    const { id } = req.params
    try {
        const [rows] = await pool.query('SELECT * FROM familias WHERE id_familia = ?', [id])
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Familia não encontrada.' })
        }
        res.status(200).json(rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao buscar familia.' })
    }
}

// Criar Nova Familia
const createFamilia = async (req, res) => {
    const { nome_responsavel, endereco, contato, n_integrantes } = req.body

    if (!nome_responsavel) {
        return res.status(400).json({ message: 'O nome do responsavel é obrigatorio' })
    }
    try {
        const query = `
        INSERT INTO familias (nome_responsavel, endereco, contato, n_integrantes)
        VALUES (?, ?, ?, ?)
        `;
        const result = await pool.query(query, [nome_responsavel, endereco, contato, n_integrantes])

        res.status(201).json({
            message: 'Familia cadastrada com sucesso!',
            id_familia: result.insertId
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar familia' })
    }
}

// Atualizar informações da familia

const updateFamilia = async (req, res) => {
    const { id } = req.params
    const { nome_responsavel, endereco, contato, n_integrantes } = req.body

    try {
        const query = `
        UPDATE familias
        SET nome_responsavel = ?, endereco = ?, contato = ?, n_integrantes = ?
        WHERE id_familia = ?
        `;
        const [result] = await pool.query(query, [nome_responsavel, endereco, contato, n_integrantes, id])

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Familia não encontrada.' })
        }

        res.status(200).json({ message: 'Familia atualizada com sucesso!' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao atualizar familia.' })
    }
}

// Deletar familia

const deleteFamilia = async (req, res) => {
    const { id } = req.params
    try {
        const query = 'DELETE FROM familias WHERE id_familia = ?';
        const [result] = await pool.query(query, [id])

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Familia não encontrada.' })
        }
        res.status(200).json({ message: 'Familia removida com sucesso!' })
    } catch (error) {
        console.error(error)
        // erro de foreign key (caso familia tenha recebido doacoes)
        if (error.code === 'ER_ROW_IS_REFERENCED_') {
            return res.status(409).json({ message: 'Não é possivel remover. Esta familia possui historico no sistema. ' })
        }
        res.status(500).json({ message: 'Erro ao remover familia.' })
    }
}

module.exports = {
    getAllFamilias,
    getFamiliaById,
    createFamilia,
    updateFamilia,
    deleteFamilia
}