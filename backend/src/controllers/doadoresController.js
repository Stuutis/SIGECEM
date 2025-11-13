const pool = require('../database/db.js')

const getAllDoadores = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM doadores')

        res.status(200).json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao buscar doadores no servidor.' })
    }
}

const createDoador = async (req, res) => {
    const { nome, tipo_pessoa, documento, telefone, email } = req.body

    if (!nome || !tipo_pessoa || !documento) {
        return res.status(400).json({ message: 'Nome, tipo_pessoa e documento são obrigatorios' })
    }
    try {
        const query = `
            INSERT INTO doadores (nome, tipo_pessoa, documento, telefone, email)
            VALUES (?,?,?,?,?)
        `

        const [result] = await pool.query(query, [nome, tipo_pessoa, documento, telefone, email])

        res.status(201).json({
            message: 'Doador cadastrado com sucesso!',
            id_doador: result.insertId
        })
    } catch (error) {
        console.error(error)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                message: 'Este documento (CPF/CNPJ) já está cadastrado'
            })
        }
        res.status(500).json({ message: 'Erro ao cadastrar doador no servidor' })
    }

}

module.exports = {
    getAllDoadores,
    createDoador
}