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

module.exports = {
    getAllDoadores,
}